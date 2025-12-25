import { useState, useEffect, useRef } from 'react';
import './App.css';
import SwipeCard from './components/SwipeCard';
import ExportModal from './components/ExportModal';
import ArchivePage from './components/ArchivePage';
import SearchBar from './components/SearchBar';
import Stats from './components/Stats';
import { Download, Archive } from 'lucide-react';
import {
  searchOpenAlex,
  searchSemanticScholar,
  fetchSemanticScholarDetails
} from './api/paperProviders';

function App() {
  const [papers, setPapers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPapers, setLikedPapers] = useState([]);
  const [dislikedPapers, setDislikedPapers] = useState([]);
  const [archivedPapers, setArchivedPapers] = useState({});
  const [currentTopic, setCurrentTopic] = useState('machine learning');
  const [isLoading, setIsLoading] = useState(false);
  const [loadHint, setLoadHint] = useState('');
  const [provider, setProvider] = useState('OpenAlex');
  const [nextCursor, setNextCursor] = useState('*');
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showArchivePage, setShowArchivePage] = useState(false);

  const abortRef = useRef(null);
  const hasLoadedInitial = useRef(false);

  const currentPaper = papers[currentIndex];
  const nextPaper = papers[currentIndex + 1];

  // Search papers via OpenAlex with Semantic Scholar fallback.
  const searchPapers = async (topic) => {
    // cancel previous
    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setLoadHint('Fetching the best matches…');
    setCurrentTopic(topic);
    setCurrentIndex(0);
    setPapers([]);

    try {
      // Prefer OpenAlex (fast, broad). Fallback to Semantic Scholar.
      try {
        setProvider('OpenAlex');
        const { papers: first, nextCursor: nc } = await searchOpenAlex({
          topic,
          perPage: 20,
          cursor: '*',
          signal: controller.signal
        });

        if (first.length === 0) throw new Error('No OpenAlex results');

        setPapers(first);
        setNextCursor(nc || null);
        setHasMore(Boolean(nc));
        setNextOffset(0);
      } catch (openAlexErr) {
        console.warn('OpenAlex failed, falling back to Semantic Scholar:', openAlexErr);
        setProvider('Semantic Scholar');
        const { papers: first, nextOffset: no, hasMore: hm } = await searchSemanticScholar({
          topic,
          limit: 20,
          offset: 0,
          signal: controller.signal
        });
        if (first.length === 0) {
          alert('No papers found for this topic');
          return;
        }
        setPapers(first);
        setNextOffset(no);
        setHasMore(Boolean(hm));
        setNextCursor('*');
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.error('Error fetching papers:', error);
      alert('Failed to load papers. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadHint('');
    }
  };

  useEffect(() => {
    if (hasLoadedInitial.current) return;
    hasLoadedInitial.current = true;
    searchPapers(currentTopic);
    // We intentionally exclude dependencies to avoid refetching on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prefetchMore = async () => {
    if (isPrefetching || !hasMore) return;
    const topic = currentTopic;
    const controller = abortRef.current;
    if (!controller) return;

    setIsPrefetching(true);
    try {
      if (provider === 'OpenAlex') {
        if (!nextCursor) return;
        const { papers: more, nextCursor: nc } = await searchOpenAlex({
          topic,
          perPage: 20,
          cursor: nextCursor,
          signal: controller.signal
        });
        if (more.length) {
          setPapers((prev) => {
            const merged = [...prev, ...more];
            return merged;
          });
        }
        setNextCursor(nc || null);
        setHasMore(Boolean(nc));
      } else {
        const { papers: more, nextOffset: no, hasMore: hm } = await searchSemanticScholar({
          topic,
          limit: 20,
          offset: nextOffset,
          signal: controller.signal
        });
        if (more.length) {
          setPapers((prev) => {
            const merged = [...prev, ...more];
            return merged;
          });
        }
        setNextOffset(no);
        setHasMore(Boolean(hm));
      }
    } catch (e) {
      if (e?.name !== 'AbortError') console.warn('Prefetch failed:', e);
    } finally {
      setIsPrefetching(false);
    }
  };

  // Lazy details for current card if needed (Semantic Scholar abstract)
  useEffect(() => {
    const paper = papers[currentIndex];
    if (!paper || !paper.needsDetails || provider !== 'Semantic Scholar') return;

    const controller = abortRef.current;
    if (!controller) return;

    let cancelled = false;
    fetchSemanticScholarDetails({ paperId: paper.externalId, signal: controller.signal })
      .then((details) => {
        if (cancelled) return;
        setPapers((prev) =>
          prev.map((p) =>
            p.id === paper.id
              ? {
                  ...p,
                  ...details,
                  needsDetails: false
                }
              : p
          )
        );
      })
      .catch((e) => {
        if (e?.name !== 'AbortError') console.warn('Details fetch failed:', e);
      });

    return () => {
      cancelled = true;
    };
  }, [currentIndex, provider, papers[currentIndex]?.id]);

  // Prefetch when the user is close to the end
  useEffect(() => {
    if (!hasMore) return;
    if (papers.length - currentIndex <= 6) {
      prefetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, papers.length, hasMore, provider]);

  const handleDecision = (decision) => {
    if (!currentPaper) return;
    
    if (decision === 'like') {
      setLikedPapers(prev => [...prev, currentPaper]);
      // Auto-archive to topic folder
      const folder = currentTopic || 'General';
      setArchivedPapers(prev => ({
        ...prev,
        [folder]: [...(prev[folder] || []), currentPaper]
      }));
    } else {
      setDislikedPapers(prev => [...prev, currentPaper]);
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const archiveCurrent = () => {
    if (!currentPaper) return;
    
    const folderName = prompt(`Archive "${currentPaper.title}" to which folder?`, currentTopic || 'General');
    
    if (folderName) {
      setArchivedPapers(prev => ({
        ...prev,
        [folderName]: [...(prev[folderName] || []), currentPaper]
      }));
      alert(`✅ Paper archived to "${folderName}" folder!`);
    }
  };

  const openArchive = () => {
    setShowArchivePage(true);
  };

  const deleteFolder = (folderName) => {
    setArchivedPapers(prev => {
      const newArchived = { ...prev };
      delete newArchived[folderName];
      return newArchived;
    });
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>ResPart</h1>
        <p>Find your research partner</p>
      </div>

      <SearchBar onSearch={searchPapers} initialValue={currentTopic} />

      <Stats 
        liked={likedPapers.length}
        disliked={dislikedPapers.length}
        archived={Object.keys(archivedPapers).reduce((sum, key) => sum + archivedPapers[key].length, 0)}
      />

      <div className="card-container">
        {isLoading ? (
          <div className="loading">{loadHint || 'Loading papers…'}</div>
        ) : currentPaper ? (
          <>
            {nextPaper && (
              <div className="next-card">
                <div className="card-preview">
                  <h3>{nextPaper.title}</h3>
                </div>
              </div>
            )}
            
            <SwipeCard
              paper={currentPaper}
              onDecision={handleDecision}
            />

            {isPrefetching && (
              <div className="loading" style={{ marginTop: 10, fontSize: 14 }}>
                Fetching more results…
              </div>
            )}
            
            <div className="corner-actions">
              <button className="corner-btn" onClick={() => setShowExportModal(true)}>
                <Download size={16} /> Export
              </button>
              <button className="corner-btn" onClick={openArchive}>
                <Archive size={16} /> Archive
              </button>
            </div>
          </>
        ) : (
          <div className="no-papers">
            <h2>🎉 All caught up!</h2>
            <p>Liked: {likedPapers.length}, Disliked: {dislikedPapers.length}</p>
            <button onClick={() => searchPapers(currentTopic)} className="restart-btn">
              Search Again
            </button>
          </div>
        )}
      </div>

      {currentPaper && (
        <div className="action-buttons">
          <button className="action-btn dislike" onClick={() => handleDecision('dislike')}>
            ✕
          </button>
          <button className="action-btn like" onClick={() => handleDecision('like')}>
            ♥
          </button>
        </div>
      )}

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        papers={likedPapers}
      />

      {showArchivePage && (
        <ArchivePage
          archivedPapers={archivedPapers}
          onClose={() => setShowArchivePage(false)}
          onDeleteFolder={deleteFolder}
        />
      )}
    </div>
  );
}

export default App;
