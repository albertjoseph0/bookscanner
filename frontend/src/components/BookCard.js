import React from 'react';

/**
 * BookCard component for displaying a single book
 * @param {Object} props - Component props
 * @param {Object} props.book - Book data object
 * @param {Function} props.onDelete - Delete callback function
 */
function BookCard({ book, onDelete }) {
  if (!book) return null;
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove "${book.title}" from your collection?`)) {
      onDelete(book.bookId);
    }
  };
  
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>Author: {book.author || 'Unknown'}</p>
      <p>Added: {new Date(book.dateAdded).toLocaleDateString()}</p>
      <button onClick={handleDelete} className="delete-btn">
        Remove
      </button>
    </div>
  );
}

export default BookCard;