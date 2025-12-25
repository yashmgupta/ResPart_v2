import { useState } from 'react';
import { X } from 'lucide-react';
import './ExportModal.css';

function ExportModal({ isOpen, onClose, papers }) {
  const [activeTab, setActiveTab] = useState('json');

  if (!isOpen) return null;

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalPapers: papers.length,
      papers: papers
    };
    downloadFile(JSON.stringify(data, null, 2), 'papers.json', 'application/json');
    alert('✅ JSON file downloaded!');
  };

  const exportCSV = () => {
    const headers = ['Title', 'Authors', 'Year', 'Venue', 'Citations', 'Abstract', 'URL'];
    const rows = papers.map(p => [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.authors.replace(/"/g, '""')}"`,
      p.year,
      `"${(p.venue || '').replace(/"/g, '""')}"`,
      p.citations || 0,
      `"${p.abstract.replace(/"/g, '""')}"`,
      `"${p.url || ''}"`
    ]);
    let csv = headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
    downloadFile(csv, 'papers.csv', 'text/csv');
    alert('✅ CSV file downloaded!');
  };

  const exportBibTeX = () => {
    let bibtex = '';
    papers.forEach((paper, idx) => {
      const key = `${paper.authors.split(',')[0].replace(/\s+/g, '')}${paper.year}_${idx + 1}`;
      bibtex += `@article{${key},\n`;
      bibtex += `  title = {${paper.title}},\n`;
      bibtex += `  author = {${paper.authors.split(', ').join(' and ')}},\n`;
      bibtex += `  year = {${paper.year}},\n`;
      if (paper.venue) bibtex += `  journal = {${paper.venue}},\n`;
      if (paper.url) bibtex += `  url = {${paper.url}},\n`;
      bibtex += `  note = {Citations: ${paper.citations}}\n}\n\n`;
    });
    downloadFile(bibtex, 'references.bib', 'text/plain');
    alert('✅ BibTeX file downloaded!');
  };

  const exportEndNote = () => {
    let endnote = '';
    papers.forEach(paper => {
      endnote += `%0 Journal Article\n`;
      endnote += `%T ${paper.title}\n`;
      paper.authors.split(', ').forEach(author => {
        endnote += `%A ${author}\n`;
      });
      endnote += `%D ${paper.year}\n`;
      if (paper.venue) endnote += `%J ${paper.venue}\n`;
      if (paper.abstract) endnote += `%X ${paper.abstract}\n`;
      if (paper.url) endnote += `%U ${paper.url}\n`;
      endnote += `%Z Citations: ${paper.citations}\n\n`;
    });
    downloadFile(endnote, 'references.enw', 'text/plain');
    alert('✅ EndNote file downloaded!');
  };

  const exportText = () => {
    let text = '=== LIKED RESEARCH PAPERS ===\n\n';
    papers.forEach((paper, i) => {
      text += `${i + 1}. ${paper.title}\n`;
      text += `   Authors: ${paper.authors}\n`;
      text += `   Year: ${paper.year}\n`;
      if (paper.venue) text += `   Venue: ${paper.venue}\n`;
      if (paper.citations) text += `   Citations: ${paper.citations}\n`;
      text += `   Abstract: ${paper.abstract}\n`;
      if (paper.url) text += `   URL: ${paper.url}\n\n`;
    });
    downloadFile(text, 'papers.txt', 'text/plain');
    alert('✅ Text file downloaded!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📤 Export Your Collection</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="modal-description">
          Choose export format for your liked papers ({papers.length} papers)
        </p>

        <div className="tabs-list">
          <button
            className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON
          </button>
          <button
            className={`tab-btn ${activeTab === 'csv' ? 'active' : ''}`}
            onClick={() => setActiveTab('csv')}
          >
            CSV
          </button>
          <button
            className={`tab-btn ${activeTab === 'bibtex' ? 'active' : ''}`}
            onClick={() => setActiveTab('bibtex')}
          >
            BibTeX
          </button>
          <button
            className={`tab-btn ${activeTab === 'endnote' ? 'active' : ''}`}
            onClick={() => setActiveTab('endnote')}
          >
            EndNote
          </button>
          <button
            className={`tab-btn ${activeTab === 'txt' ? 'active' : ''}`}
            onClick={() => setActiveTab('txt')}
          >
            Text
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'json' && (
            <div className="tab-panel">
              <p>Export as JSON format - perfect for importing into other apps or databases.</p>
              <button className="download-btn" onClick={exportJSON}>💾 Download JSON</button>
            </div>
          )}
          {activeTab === 'csv' && (
            <div className="tab-panel">
              <p>Export as CSV spreadsheet - open in Excel, Google Sheets, or any spreadsheet software.</p>
              <button className="download-btn" onClick={exportCSV}>📊 Download CSV</button>
            </div>
          )}
          {activeTab === 'bibtex' && (
            <div className="tab-panel">
              <p>Export as BibTeX format - for LaTeX, Overleaf, and academic citation managers.</p>
              <button className="download-btn" onClick={exportBibTeX}>📖 Download BibTeX</button>
            </div>
          )}
          {activeTab === 'endnote' && (
            <div className="tab-panel">
              <p>Export as EndNote format - compatible with EndNote, Mendeley, and Zotero.</p>
              <button className="download-btn" onClick={exportEndNote}>📋 Download EndNote</button>
            </div>
          )}
          {activeTab === 'txt' && (
            <div className="tab-panel">
              <p>Export as plain text - simple, readable format for notes and documentation.</p>
              <button className="download-btn" onClick={exportText}>📄 Download Text</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
