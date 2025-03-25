// Database adapter to support both SQLite and Azure SQL
const path = require('path');
require('dotenv').config();

// Dynamically determine which database to use
const USE_AZURE = process.env.USE_AZURE_DB === 'true';

// Import the appropriate database module
const dbModule = USE_AZURE 
  ? require('./azure-db')
  : require('./db');

/**
 * Database adapter with unified methods for both database types
 */
class DatabaseAdapter {
  constructor() {
    this.db = null;
    this.type = USE_AZURE ? 'azure' : 'sqlite';
  }

  /**
   * Initialize the database connection
   */
  async initialize() {
    this.db = await dbModule.initializeDatabase();
    console.log(`Initialized ${this.type} database connection`);
    return this;
  }

  /**
   * Execute a query that returns all rows
   * @param {string} query - SQL query to execute
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Query results
   */
  async query(query, params = []) {
    if (this.type === 'azure') {
      const request = this.db.request();
      
      // Add parameters to the request
      if (params && params.length > 0) {
        params.forEach((param, index) => {
          request.input(`param${index}`, param);
        });
        
        // Replace ? placeholders with @param0, @param1, etc.
        let paramIndex = 0;
        const azureQuery = query.replace(/\?/g, () => `@param${paramIndex++}`);
        
        const result = await request.query(azureQuery);
        return result.recordset;
      } else {
        const result = await request.query(query);
        return result.recordset;
      }
    } else {
      // SQLite query
      return await this.db.all(query, params);
    }
  }

  /**
   * Execute a query that doesn't return results
   * @param {string} query - SQL query to execute
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Execution result
   */
  async execute(query, params = []) {
    if (this.type === 'azure') {
      const request = this.db.request();
      
      // Add parameters to the request
      if (params && params.length > 0) {
        params.forEach((param, index) => {
          request.input(`param${index}`, param);
        });
        
        // Replace ? placeholders with @param0, @param1, etc.
        let paramIndex = 0;
        const azureQuery = query.replace(/\?/g, () => `@param${paramIndex++}`);
        
        return await request.query(azureQuery);
      } else {
        return await request.query(query);
      }
    } else {
      // SQLite execution
      return await this.db.run(query, params);
    }
  }

  /**
   * Close the database connection
   */
  async close() {
    if (this.type === 'azure') {
      await this.db.close();
    }
    // SQLite connection doesn't need explicit closing
    console.log(`Closed ${this.type} database connection`);
  }
}

module.exports = { 
  createAdapter: async () => {
    const adapter = new DatabaseAdapter();
    await adapter.initialize();
    return adapter;
  }
};