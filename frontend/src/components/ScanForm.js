import React, { useState } from 'react';

/**
 * ScanForm component for uploading and processing bookshelf images
 * @param {Object} props - Component props
 * @param {Function} props.onUpload - Upload callback function
 * @param {boolean} props.loading - Loading state
 */
function ScanForm({ onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    
    try {
      const result = await onUpload(selectedFile);
      
      if (result.success) {
        alert(`Detected ${result.books.length} books!`);
      } else {
        alert('Error processing image');
      }
      
      // Reset file input
      setSelectedFile(null);
      document.getElementById('file-input').value = '';
    } catch (error) {
      alert('Error processing image');
    }
  };
  
  return (
    <div className="scan-section">
      <h2>Scan Bookshelf</h2>
      <input 
        id="file-input"
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      <button 
        onClick={handleUpload} 
        disabled={loading || !selectedFile}
        className="upload-button"
      >
        {loading ? 'Processing...' : 'Scan Bookshelf'}
      </button>
    </div>
  );
}

export default ScanForm;