import { useState } from 'react';
import { X, FolderOpen, FileText, Trash2 } from 'lucide-react';
import './ArchivePage.css';

function ArchivePage({ archivedPapers, onClose, onDeleteFolder }) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [expandedPaper, setExpandedPaper] = useState(null);

  const folders = Object.keys(archivedPapers);

  return (
    <div className="archive-page-overlay">
      <div className="archive-page">
        <div className="archive-header">
          <div className="archive-title">
            <FolderOpen size={24} />
            <h2>Archive</h2>
          </div>
          <button className="archive-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="archive-content">
          {folders.length === 0 ? (
            <div className="archive-empty">
              <FolderOpen size={48} style={{ opacity: 0.3 }} />
              <p>No archived papers yet</p>
              <p className="archive-empty-hint">Like papers to auto-archive them by topic</p>
            </div>
          ) : selectedFolder ? (
            <div className="folder-view">
              <div className="folder-header">
                <button className="back-btn" onClick={() => setSelectedFolder(null)}>
                  ← Back to Folders
                </button>
                <h3>📂 {selectedFolder}</h3>
                <button 
                  className="delete-folder-btn"
                  onClick={() => {
                    if (confirm(`Delete folder "${selectedFolder}" and all papers inside?`)) {
                      onDeleteFolder(selectedFolder);
                      setSelectedFolder(null);
                    }
                  }}
                >
                  <Trash2 size={16} /> Delete Folder
                </button>
              </div>

              <div className="folder-papers">
                {archivedPapers[selectedFolder].map((paper, idx) => (
                  <div 
                    key={idx} 
                    className={`paper-item ${expandedPaper === idx ? 'expanded' : ''}`}
                    onClick={() => setExpandedPaper(expandedPaper === idx ? null : idx)}
                  >
                    <div className="paper-item-header">
                      <FileText size={16} />
                      <h4>{paper.title}</h4>
                    </div>
                    <div className="paper-item-meta">
                      <span>👥 {paper.authors}</span>
                      <span>📅 {paper.year}</span>
                      <span>📚 {paper.citations} citations</span>
                    </div>
                    {expandedPaper === idx && (
                      <div className="paper-item-details">
                        {paper.venue && <p><strong>Venue:</strong> {paper.venue}</p>}
                        <p><strong>Abstract:</strong> {paper.abstract}</p>
                        <div className="paper-item-links">
                          {paper.url && paper.url !== '#' && (
                            <a href={paper.url} target="_blank" rel="noopener noreferrer">
                              🔗 View Paper
                            </a>
                          )}
                          {paper.pdfUrl && (
                            <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                              📄 PDF
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="folders-grid">
              {folders.map((folderName) => (
                <div 
                  key={folderName} 
                  className="folder-card"
                  onClick={() => setSelectedFolder(folderName)}
                >
                  <div className="folder-icon">📁</div>
                  <div className="folder-info">
                    <h3>{folderName}</h3>
                    <p>{archivedPapers[folderName].length} papers</p>
                  </div>
                  <button 
                    className="folder-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete folder "${folderName}"?`)) {
                        onDeleteFolder(folderName);
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="archive-footer">
          <div className="archive-stats">
            <div className="stat-item">
              <strong>{folders.length}</strong>
              <span>Folders</span>
            </div>
            <div className="stat-item">
              <strong>{Object.values(archivedPapers).reduce((sum, papers) => sum + papers.length, 0)}</strong>
              <span>Total Papers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchivePage;
