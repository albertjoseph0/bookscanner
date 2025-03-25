import React from 'react';

/**
 * SortControls component for sorting the book collection
 * @param {Object} props - Component props
 * @param {string} props.sortBy - Current sort criterion
 * @param {Function} props.onSort - Sort callback function
 */
function SortControls({ sortBy, onSort }) {
  return (
    <div className="sort-controls">
      <span>Sort by: </span>
      <button 
        onClick={() => onSort('title')} 
        className={sortBy === 'title' ? 'active' : ''}
      >
        Title
      </button>
      <button 
        onClick={() => onSort('author')} 
        className={sortBy === 'author' ? 'active' : ''}
      >
        Author
      </button>
      <button 
        onClick={() => onSort('dateAdded')} 
        className={sortBy === 'dateAdded' ? 'active' : ''}
      >
        Date Added
      </button>
    </div>
  );
}

export default SortControls;