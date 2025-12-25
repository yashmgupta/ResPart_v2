const OPENALEX_BASE = 'https://api.openalex.org';
const SEMSCH_BASE = 'https://api.semanticscholar.org/graph/v1';

export function openAlexAbstractToText(abstractInvertedIndex, maxChars = 1200) {
  if (!abstractInvertedIndex || typeof abstractInvertedIndex !== 'object') return null;

  const positionToToken = new Map();
  for (const [token, positions] of Object.entries(abstractInvertedIndex)) {
    if (!Array.isArray(positions)) continue;
    for (const pos of positions) {
      if (typeof pos === 'number') positionToToken.set(pos, token);
    }
  }

  const orderedPositions = Array.from(positionToToken.keys()).sort((a, b) => a - b);
  if (orderedPositions.length === 0) return null;

  const tokens = orderedPositions.map((p) => positionToToken.get(p));
  const text = tokens.join(' ').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  return text.length > maxChars ? text.slice(0, maxChars).trimEnd() + '…' : text;
}

function pickBestOpenAlexPdf(work) {
  const loc = work?.best_oa_location;
  const pdf = loc?.pdf_url || loc?.url_for_pdf || null;
  return pdf || null;
}

function normalizeAuthorsOpenAlex(work) {
  const authorships = work?.authorships;
  if (!Array.isArray(authorships) || authorships.length === 0) return 'Unknown';
  const names = authorships
    .map((a) => a?.author?.display_name)
    .filter(Boolean)
    .slice(0, 10);
  return names.length ? names.join(', ') : 'Unknown';
}

function normalizeAuthorsS2(paper) {
  const authors = paper?.authors;
  if (!Array.isArray(authors) || authors.length === 0) return 'Unknown';
  const names = authors.map((a) => a?.name).filter(Boolean).slice(0, 10);
  return names.length ? names.join(', ') : 'Unknown';
}

export async function searchOpenAlex({ topic, perPage = 20, cursor = '*', signal }) {
  const params = new URLSearchParams();
  params.set('search', topic);
  params.set('per-page', String(perPage));
  params.set('cursor', cursor);
  params.set(
    'select',
    [
      'id',
      'doi',
      'title',
      'publication_year',
      'cited_by_count',
      'primary_location',
      'best_oa_location',
      'host_venue',
      'authorships',
      'abstract_inverted_index'
    ].join(',')
  );

  const url = `${OPENALEX_BASE}/works?${params.toString()}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`OpenAlex search failed (${res.status})`);
  const json = await res.json();

  const results = Array.isArray(json?.results) ? json.results : [];
  const papers = results.map((work) => {
    const abstract = openAlexAbstractToText(work.abstract_inverted_index) || 'No abstract available';
    const venue =
      work?.host_venue?.display_name ||
      work?.primary_location?.source?.display_name ||
      'Unknown venue';

    return {
      id: work.id,
      title: work.title || 'No title',
      authors: normalizeAuthorsOpenAlex(work),
      year: work.publication_year || 'N/A',
      abstract,
      citations: work.cited_by_count || 0,
      url: work?.primary_location?.landing_page_url || work?.id || '#',
      pdfUrl: pickBestOpenAlexPdf(work),
      venue,
      topic,
      source: 'OpenAlex',
      externalId: work.id,
      needsDetails: false
    };
  });

  const nextCursor = json?.meta?.next_cursor || null;
  return { papers, nextCursor };
}

export async function searchSemanticScholar({ topic, limit = 20, offset = 0, signal }) {
  const params = new URLSearchParams();
  params.set('query', topic);
  params.set('offset', String(offset));
  params.set('limit', String(limit));
  params.set(
    'fields',
    'paperId,title,authors,year,citationCount,venue,url,openAccessPdf,publicationDate'
  );

  const url = `${SEMSCH_BASE}/paper/search?${params.toString()}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Semantic Scholar search failed (${res.status})`);
  const json = await res.json();

  const results = Array.isArray(json?.data) ? json.data : [];
  const papers = results.map((paper) => ({
    id: paper.paperId,
    title: paper.title || 'No title',
    authors: normalizeAuthorsS2(paper),
    year: paper.year || paper.publicationDate?.substring(0, 4) || 'N/A',
    abstract: 'Loading abstract…',
    citations: paper.citationCount || 0,
    url: paper.url || '#',
    pdfUrl: paper.openAccessPdf?.url || null,
    venue: paper.venue || 'Unknown venue',
    topic,
    source: 'Semantic Scholar',
    externalId: paper.paperId,
    needsDetails: true
  }));

  const hasMore = results.length === limit;
  return { papers, nextOffset: offset + limit, hasMore };
}

export async function fetchSemanticScholarDetails({ paperId, signal }) {
  const fields = 'abstract,openAccessPdf,url,venue,year,publicationDate,title,authors,citationCount';
  const url = `${SEMSCH_BASE}/paper/${encodeURIComponent(paperId)}?fields=${encodeURIComponent(fields)}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Semantic Scholar details failed (${res.status})`);
  const paper = await res.json();

  return {
    abstract: paper.abstract || 'No abstract available',
    pdfUrl: paper.openAccessPdf?.url || null,
    url: paper.url || '#',
    venue: paper.venue || 'Unknown venue',
    year: paper.year || paper.publicationDate?.substring(0, 4) || 'N/A',
    citations: paper.citationCount || 0,
    authors: normalizeAuthorsS2(paper),
    title: paper.title || 'No title'
  };
}
