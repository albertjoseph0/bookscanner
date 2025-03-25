// Test script for database migration
require('dotenv').config();
const { initializeDatabase: initSqlite } = require('./config/db');
const { initializeDatabase: initAzure, sql } = require('./config/azure-db');

async function testConnections() {
  console.log('Testing database connections...');
  
  // Test SQLite connection
  console.log('\n1. Testing SQLite connection:');
  try {
    const sqliteDb = await initSqlite();
    console.log('✅ SQLite connection successful');
    
    // Get book count from SQLite
    const books = await sqliteDb.all('SELECT COUNT(*) as count FROM books');
    console.log(`📚 Found ${books[0].count} books in SQLite database`);
  } catch (error) {
    console.error('❌ SQLite connection failed:', error.message);
  }
  
  // Check if Azure SQL credentials are provided
  if (!process.env.AZURE_SQL_SERVER || !process.env.AZURE_SQL_DATABASE) {
    console.log('\n2. Skipping Azure SQL test: credentials not provided in .env file');
    console.log('   Set AZURE_SQL_SERVER, AZURE_SQL_DATABASE, AZURE_SQL_USER, and AZURE_SQL_PASSWORD to test');
    return;
  }
  
  // Test Azure SQL connection
  console.log('\n2. Testing Azure SQL connection:');
  try {
    const azurePool = await initAzure();
    console.log('✅ Azure SQL connection successful');
    
    // Test query
    const result = await azurePool.request().query('SELECT @@VERSION AS version');
    console.log(`🔹 SQL Server version: ${result.recordset[0].version.split('\n')[0]}`);
    
    // Check if books table exists
    try {
      const tableResult = await azurePool.request().query(`
        SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'books'
      `);
      
      if (tableResult.recordset[0].count > 0) {
        // Count books if table exists
        const booksResult = await azurePool.request().query('SELECT COUNT(*) as count FROM books');
        console.log(`📚 Found ${booksResult.recordset[0].count} books in Azure SQL database`);
      } else {
        console.log('🔹 Books table does not exist yet (will be created during migration)');
      }
    } catch (error) {
      console.error('❌ Error checking books table:', error.message);
    }
    
    // Close the connection
    await azurePool.close();
    
  } catch (error) {
    console.error('❌ Azure SQL connection failed:', error.message);
    console.error('   Please check your credentials and ensure your IP is allowed in Azure firewall rules');
  }
  
  console.log('\nConnection tests completed.');
}

// Run the tests
testConnections().catch(console.error);