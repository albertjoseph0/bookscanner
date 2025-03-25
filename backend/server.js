// server.js - Local Express server with SQLite integration
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Database setup
let db;

// Initialize database connection
async function initializeDatabase() {
  db = await open({
    filename: path.join(__dirname, 'books.db'),
    driver: sqlite3.Database
  });
  
  // Create books table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      bookId TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log('Database initialized');
}

// API Endpoints

// Upload and process bookshelf image
app.post('/api/scan', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imagePath = req.file.path;
    
    // Read the image file as a base64 string
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Call OpenAI Vision API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identify all book titles and authors visible on the book spines in this bookshelf image. Return a JSON array with objects containing only 'title' and 'author' for each book you can identify. Focus only on clearly readable text on the spines."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    
    // Parse the response to extract book data
    const content = response.data.choices[0].message.content;
    
    // Extract JSON array from the response content
    // This handles cases where the API might return extra text surrounding the JSON
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    let booksData = [];
    
    if (jsonMatch) {
      booksData = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Could not parse JSON response from OpenAI');
    }
    
    // Save books to database
    const savedBooks = [];
    
    for (const book of booksData) {
      if (book.title && book.author) {
        const bookId = uuidv4();
        await db.run(
          'INSERT INTO books (bookId, title, author) VALUES (?, ?, ?)',
          [bookId, book.title, book.author]
        );
        
        savedBooks.push({
          bookId,
          title: book.title,
          author: book.author,
          dateAdded: new Date().toISOString()
        });
      }
    }
    
    // Clean up the uploaded file
    fs.unlinkSync(imagePath);
    
    res.json({ success: true, books: savedBooks });
    
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image', details: error.message });
  }
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await db.all('SELECT * FROM books ORDER BY dateAdded DESC');
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM books WHERE bookId = ?', id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Error deleting book' });
  }
});

// Add this after the other routes in server.js
app.get('/', (req, res) => {
    res.send('BookScanner API is running. Use /api/books to get books, /api/scan to process images.');
  });
  
// Start the server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

