import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('dateAdded');
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Updated API URL to point to our local Express server
      const response = await fetch('http://localhost:3001/api/books');
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      // Updated API URL to point to our local Express server
      const response = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      // Updated to match our new API response format
      if (result.success) {
        alert(`Detected ${result.books.length} books!`);
      } else {
        alert('Error processing image');
      }
      
      // Refresh the book list
      fetchBooks();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error processing image');
      setLoading(false);
    }
  };

  const handleSort = (criteria) => {
    setSortBy(criteria);
    
    const sortedBooks = [...books].sort((a, b) => {
      if (criteria === 'title') return a.title.localeCompare(b.title);
      if (criteria === 'author') return a.author.localeCompare(b.author);
      if (criteria === 'dateAdded') return new Date(b.dateAdded) - new Date(a.dateAdded);
      return 0;
    });
    
    setBooks(sortedBooks);
  };

  const handleDelete = async (bookId) => {
    try {
      // Updated API URL to point to our local Express server
      await fetch(`http://localhost:3001/api/books/${bookId}`, {
        method: 'DELETE',
      });
      
      // Update local state to remove deleted book
      setBooks(books.filter(book => book.bookId !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error deleting book');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>BookScanner</h1>
      </header>
      
      <div className="scan-section">
        <h2>Scan Bookshelf</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading || !selectedFile}>
          {loading ? 'Processing...' : 'Scan Bookshelf'}
        </button>
      </div>
      
      <div className="collection-section">
        <h2>Your Book Collection</h2>
        
        <div className="sort-controls">
          <span>Sort by: </span>
          <button onClick={() => handleSort('title')} className={sortBy === 'title' ? 'active' : ''}>
            Title
          </button>
          <button onClick={() => handleSort('author')} className={sortBy === 'author' ? 'active' : ''}>
            Author
          </button>
          <button onClick={() => handleSort('dateAdded')} className={sortBy === 'dateAdded' ? 'active' : ''}>
            Date Added
          </button>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : books.length === 0 ? (
          <p>No books in your collection yet. Scan your bookshelf to add books!</p>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.bookId} className="book-card">
                <h3>{book.title}</h3>
                <p>Author: {book.author || 'Unknown'}</p>
                <p>Added: {new Date(book.dateAdded).toLocaleDateString()}</p>
                <button onClick={() => handleDelete(book.bookId)} className="delete-btn">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;