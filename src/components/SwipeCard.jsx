import { motion, useMotionValue, useTransform } from 'framer-motion';
import './SwipeCard.css';

function SwipeCard({ paper, onDecision }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [40, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-40, -120], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 120) {
      onDecision('like');
    } else if (info.offset.x < -120) {
      onDecision('dislike');
    }
  };

  return (
    <motion.div
      className="swipe-card"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.25}
      style={{ x, rotate }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <motion.div className="card-badge like-badge" style={{ opacity: likeOpacity }}>
        LIKE
      </motion.div>
      <motion.div className="card-badge nope-badge" style={{ opacity: nopeOpacity }}>
        NOPE
      </motion.div>

      <div className="card-content">
        <h2 className="card-title">{paper.title}</h2>
        <div className="card-authors">👥 {paper.authors}</div>
        <div className="card-year">
          📅 {paper.year}
          {paper.citations > 0 && ` | 📚 ${paper.citations} citations`}
        </div>
        {paper.venue && paper.venue !== 'Unknown venue' && (
          <div className="card-venue">📍 {paper.venue}</div>
        )}
        <div className="card-abstract">{paper.abstract}</div>
        {paper.pdfUrl && (
          <div className="card-pdf">
            <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
              📄 Open Access PDF
            </a>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="card-source">
          {paper.source || 'Source'}
          {paper.url && paper.url !== '#' && (
            <>
              {' | '}
              <a href={paper.url} target="_blank" rel="noopener noreferrer">
                View Paper
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SwipeCard;
