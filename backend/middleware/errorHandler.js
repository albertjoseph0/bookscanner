// Error handling middleware
const { config } = require('../config/env');

/**
 * Global error handler middleware
 * Formats errors based on environment
 * Prevents sensitive error details from being exposed in production
 */
function errorHandler(err, req, res, next) {
  // Log error details for debugging (but sanitize sensitive data)
  const sanitizedError = {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  };
  
  // Don't log potentially sensitive data
  delete sanitizedError.headers;
  delete sanitizedError.authorization;
  
  console.error('Error:', sanitizedError);
  
  // Default error status and message
  const status = err.status || 500;
  
  // Generic message for production, detailed for development
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction && status === 500 
    ? 'Internal Server Error' 
    : err.message || 'Internal Server Error';
  
  // In development, include full error details
  // In production, send limited information
  const errorResponse = {
    error: message,
    status,
  };
  
  // Include stack trace only in development
  if (!isProduction) {
    errorResponse.stack = err.stack;
    errorResponse.details = err.details || err.cause;
  }
  
  // For rate limit errors, keep the message consistent in all environments
  if (err.statusCode === 429) {
    errorResponse.error = err.message;
  }
  
  res.status(status).json(errorResponse);
}

module.exports = errorHandler;