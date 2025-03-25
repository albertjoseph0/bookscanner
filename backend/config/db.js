// Database configuration
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

/**
 * Initialize database connection and create tables if they don't exist
 * @returns {Promise<object>} Database connection
 */
async function initializeDatabase() {
  try {
    const db = await open({
      filename: path.join(__dirname, '../books.db'),
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
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };