import React from 'react';
import './App.css';
import { useBooks } from './hooks/useBooks';
import ScanForm from './components/ScanForm';
import BookGrid from './components/BookGrid';
import SortControls from './components/SortControls';

function App() {
  const { 
    books, 
    loading, 
    error, 
    sortBy, 
    uploadImage, 
    removeBook, 
    sortBooks 
  } = useBooks();

  return (
    <div className="App">
      <header className="App-header">
        <h1>BookScanner</h1>
      </header>
      
      <ScanForm onUpload={uploadImage} loading={loading} />
      
      <div className="collection-section">
        <h2>Your Book Collection</h2>
        
        {error && <p className="error-message">{error}</p>}
        
        <SortControls sortBy={sortBy} onSort={sortBooks} />
        
        <BookGrid 
          books={books} 
          onDelete={removeBook} 
          loading={loading} 
        />
      </div>
    </div>
  );
}

export default App;