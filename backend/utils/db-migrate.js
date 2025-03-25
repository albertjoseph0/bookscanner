// Database migration utility for SQLite to Azure SQL
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import database modules
const { initializeDatabase: initSqlite } = require('../config/db');
const { initializeDatabase: initAzure, sql } = require('../config/azure-db');

/**
 * Migrate data from SQLite to Azure SQL Database
 */
async function migrateSqliteToAzure() {
  let sqliteDb = null;
  let azurePool = null;

  try {
    console.log('Starting database migration: SQLite → Azure SQL...');
    
    // Connect to both databases
    sqliteDb = await initSqlite();
    azurePool = await initAzure();
    
    // Get all books from SQLite
    console.log('Fetching books from SQLite...');
    const books = await sqliteDb.all('SELECT * FROM books');
    console.log(`Found ${books.length} books to migrate`);
    
    if (books.length === 0) {
      console.log('No books to migrate');
      return;
    }
    
    // Create transaction for Azure
    const transaction = new sql.Transaction(azurePool);
    await transaction.begin();
    
    try {
      // Insert each book into Azure SQL
      console.log('Inserting books into Azure SQL...');
      for (const book of books) {
        const request = new sql.Request(transaction);
        
        await request
          .input('bookId', sql.UniqueIdentifier, book.bookId)
          .input('title', sql.NVarChar, book.title)
          .input('author', sql.NVarChar, book.author)
          .input('dateAdded', sql.DateTime2, new Date(book.dateAdded))
          .query(`
            INSERT INTO books (bookId, title, author, dateAdded)
            VALUES (@bookId, @title, @author, @dateAdded)
          `);
      }
      
      // Commit the transaction
      await transaction.commit();
      console.log('Migration completed successfully');
      
      // Optional: Export books to JSON as backup
      const backupPath = path.join(__dirname, '../data-backup.json');
      fs.writeFileSync(backupPath, JSON.stringify(books, null, 2));
      console.log(`Books backup saved to ${backupPath}`);
      
    } catch (error) {
      // Rollback on error
      await transaction.rollback();
      console.error('Transaction failed:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connections
    if (azurePool) {
      await azurePool.close();
    }
    console.log('Database connections closed');
  }
}

// Run migration if script is executed directly
if (require.main === module) {
  migrateSqliteToAzure();
}

module.exports = { migrateSqliteToAzure };