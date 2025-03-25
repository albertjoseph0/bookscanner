// Script to migrate data from SQLite to Azure SQL
require('dotenv').config();
const { migrateSqliteToAzure } = require('./backend/utils/db-migrate');

// Check if running in the correct environment
if (!process.env.AZURE_SQL_SERVER || !process.env.AZURE_SQL_DATABASE) {
  console.error('Error: Azure SQL connection information missing in .env file.');
  console.error('Please set AZURE_SQL_SERVER, AZURE_SQL_DATABASE, AZURE_SQL_USER, and AZURE_SQL_PASSWORD');
  process.exit(1);
}

console.log('Starting data migration from SQLite to Azure SQL...');
console.log(`Target: ${process.env.AZURE_SQL_SERVER}/${process.env.AZURE_SQL_DATABASE}`);

migrateSqliteToAzure()
  .then(() => {
    console.log('Migration completed successfully!');
    console.log('To switch to Azure SQL, set USE_AZURE_DB=true in your .env file');
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });