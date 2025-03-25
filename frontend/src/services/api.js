/**
 * API client for communicating with the backend
 */

// API base URL - could be moved to environment config
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Fetch all books from the API
 * @returns {Promise<Array>} Books array
 */
export async function fetchBooks() {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

/**
 * Upload an image to scan books
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<Object>} Scan result
 */
export async function scanBookshelf(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error scanning bookshelf:', error);
    throw error;
  }
}

/**
 * Delete a book by ID
 * @param {string} bookId - ID of the book to delete
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteBook(bookId) {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}