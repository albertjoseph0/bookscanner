// Book controller
const Book = require('../models/Book');
const OpenAIService = require('../services/openaiService');
const fs = require('fs');
const path = require('path');

let db; // Will be initialized in setup

/**
 * Set up the controller with database connection
 * @param {Object} database - Database connection
 */
function setup(database) {
  db = database;
}

/**
 * Get all books from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getAllBooks(req, res) {
  try {
    const books = await db.all('SELECT * FROM books ORDER BY dateAdded DESC');
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Error fetching books' });
  }
}

/**
 * Process an uploaded image to detect books
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function processBookshelfImage(req, res) {
  try {
    console.log('Processing bookshelf image - request received');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imagePath = req.file.path;
    console.log('Image uploaded to:', imagePath);
    
    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created uploads directory');
    }
    
    // Read the image file as a base64 string
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    console.log('Image converted to base64 (length):', base64Image.length);
    
    // Detect books using OpenAI
    console.log('Calling OpenAI service...');
    const booksData = await OpenAIService.detectBooksInImage(base64Image);
    console.log('Detected books:', booksData.length);
    
    // Save books to database
    const savedBooks = [];
    
    for (const bookData of booksData) {
      if (bookData.title && bookData.author) {
        const book = new Book({
          title: bookData.title,
          author: bookData.author
        });
        
        await db.run(
          'INSERT INTO books (bookId, title, author) VALUES (?, ?, ?)',
          [book.bookId, book.title, book.author]
        );
        
        savedBooks.push(book);
      }
    }
    
    console.log('Books saved to database:', savedBooks.length);
    
    // Clean up the uploaded file
    fs.unlinkSync(imagePath);
    console.log('Deleted temporary image file');
    
    res.json({ success: true, books: savedBooks });
    
  } catch (error) {
    console.error('Error processing image:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('API response error:', error.response.status, error.response.data);
    }
    
    res.status(500).json({ 
      error: 'Error processing image', 
      details: error.message 
    });
  }
}

/**
 * Delete a book by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM books WHERE bookId = ?', id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Error deleting book' });
  }
}

module.exports = {
  setup,
  getAllBooks,
  processBookshelfImage,
  deleteBook
};