// server.js - Express server with SQLite integration
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database and controllers
const { initializeDatabase } = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middleware/errorHandler');
const bookController = require('./controllers/bookController');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Apply middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('BookScanner API is running. Use /api/books to get books, /api/scan to process images.');
});

// Apply API routes
app.use('/api', bookRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
async function startServer() {
  try {
    // Initialize database
    const db = await initializeDatabase();
    
    // Pass database connection to controllers
    bookController.setup(db);
    
    // Start listening
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };