// Azure SQL Database configuration
const sql = require('mssql');
require('dotenv').config();

/**
 * SQL Server connection configuration
 */
const config = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false, // For secure connections
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

/**
 * Initialize SQL Server connection pool and create tables if they don't exist
 * @returns {Promise<sql.ConnectionPool>} Database connection pool
 */
async function initializeDatabase() {
  try {
    // Create a connection pool
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    
    console.log('Azure SQL Database connected');
    
    // Create books table if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'books')
      BEGIN
        CREATE TABLE books (
          bookId UNIQUEIDENTIFIER PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          author NVARCHAR(255) NOT NULL,
          dateAdded DATETIME2 DEFAULT GETDATE()
        );
      END
    `);
    
    console.log('Azure SQL Database tables initialized');
    return pool;
  } catch (error) {
    console.error('Azure SQL Database initialization failed:', error);
    throw error;
  }
}

module.exports = { initializeDatabase, sql };