// server.js - Express server with database integration
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database adapter and controllers
const { createAdapter } = require('./config/db-adapter');
const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middleware/errorHandler');
const bookController = require('./controllers/bookController');
const { securityHeaders, apiLimiter } = require('./middleware/security');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Apply security middleware (but disable CSP for development)
app.use(securityHeaders);

// Configure CORS to allow requests from all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Apply global rate limiter, but only in production
if (process.env.NODE_ENV === 'production') {
  app.use(apiLimiter);
}

// Body parser middleware (with size limits)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check route
app.get('/', (req, res) => {
  res.send('BookScanner API is running. Use /api/books to get books, /api/scan to process images.');
});

// Apply API routes
app.use('/api', bookRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
async function startServer() {
  try {
    // Log database type being used
    const dbType = process.env.USE_AZURE_DB === 'true' ? 'Azure SQL' : 'SQLite';
    console.log(`Using database: ${dbType}`);
    
    // Initialize database adapter
    const dbAdapter = await createAdapter();
    
    // Pass database adapter to controllers
    bookController.setup(dbAdapter);
    
    // Start listening
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Setup graceful shutdown to close database
    const shutdown = async () => {
      console.log('Closing database connections...');
      if (dbAdapter) {
        await dbAdapter.close();
      }
      console.log('Server shutting down');
      process.exit(0);
    };
    
    // Graceful shutdown handlers
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
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