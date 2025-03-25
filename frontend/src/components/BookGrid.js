import React from 'react';
import BookCard from './BookCard';

/**
 * BookGrid component for displaying a grid of books
 * @param {Object} props - Component props
 * @param {Array} props.books - Array of book objects
 * @param {Function} props.onDelete - Delete callback function
 * @param {boolean} props.loading - Loading state
 */
function BookGrid({ books, onDelete, loading }) {
  if (loading) {
    return <p>Loading books...</p>;
  }
  
  if (!books || books.length === 0) {
    return <p>No books in your collection yet. Scan your bookshelf to add books!</p>;
  }
  
  return (
    <div className="books-grid">
      {books.map((book) => (
        <BookCard key={book.bookId} book={book} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default BookGrid;