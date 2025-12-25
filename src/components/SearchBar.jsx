import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, initialValue }) {
  const [topic, setTopic] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onSearch(topic.trim());
    }
  };

  return (
    <div className="search-box">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g., machine learning, DNA sequencing)"
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Find Papers
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
