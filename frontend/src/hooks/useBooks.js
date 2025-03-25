import { useState, useEffect, useCallback } from 'react';
import { fetchBooks, scanBookshelf, deleteBook } from '../services/api';

/**
 * Custom hook for managing books data and operations
 * @returns {Object} Book state and operations
 */
export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('dateAdded');
  
  /**
   * Load books from the API
   */
  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load books when the hook is first used
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);
  
  /**
   * Upload and process a bookshelf image
   * @param {File} imageFile - Image file to process
   * @returns {Promise<Object>} Processing result
   */
  const uploadImage = async (imageFile) => {
    try {
      setLoading(true);
      setError(null);
      const result = await scanBookshelf(imageFile);
      await loadBooks(); // Refresh book list
      return result;
    } catch (err) {
      setError('Failed to process image');
      console.error('Error processing image:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Remove a book from the collection
   * @param {string} bookId - ID of book to remove
   */
  const removeBook = async (bookId) => {
    try {
      setError(null);
      await deleteBook(bookId);
      // Update local state for immediate UI feedback
      setBooks(books.filter(book => book.bookId !== bookId));
    } catch (err) {
      setError('Failed to delete book');
      console.error('Error deleting book:', err);
    }
  };
  
  /**
   * Sort books by the specified criteria
   * @param {string} criteria - Sorting criteria (title, author, dateAdded)
   */
  const sortBooks = (criteria) => {
    setSortBy(criteria);
    
    const sortedBooks = [...books].sort((a, b) => {
      if (criteria === 'title') return a.title.localeCompare(b.title);
      if (criteria === 'author') return a.author.localeCompare(b.author);
      if (criteria === 'dateAdded') return new Date(b.dateAdded) - new Date(a.dateAdded);
      return 0;
    });
    
    setBooks(sortedBooks);
  };
  
  return {
    books,
    loading,
    error,
    sortBy,
    loadBooks,
    uploadImage,
    removeBook,
    sortBooks,
  };
}