import './Stats.css';

function Stats({ liked, disliked, archived }) {
  return (
    <div className="stats">
      <div className="stat">
        <div className="stat-value">{liked}</div>
        <div className="stat-label">Liked</div>
      </div>
      <div className="stat">
        <div className="stat-value">{disliked}</div>
        <div className="stat-label">Disliked</div>
      </div>
      <div className="stat">
        <div className="stat-value">{archived}</div>
        <div className="stat-label">Archived</div>
      </div>
    </div>
  );
}

export default Stats;
