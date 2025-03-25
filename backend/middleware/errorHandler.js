// Error handling middleware
const { config } = require('../config/env');

/**
 * Global error handler middleware
 * Formats errors based on environment
 * Prevents sensitive error details from being exposed in production
 */
function errorHandler(err, req, res, next) {
  // Log error details for debugging
  console.error('Error:', err);
  
  // Default error status and message
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // In development, include full error details
  // In production, send limited information
  const errorResponse = {
    error: message,
    status,
  };
  
  // Include stack trace only in development
  if (config.nodeEnv === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.details || err.cause;
  }
  
  res.status(status).json(errorResponse);
}

module.exports = errorHandler;