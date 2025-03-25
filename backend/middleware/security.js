// Security middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

/**
 * Configure and export security middleware
 */

// Set up basic security headers with helmet, but less strict in development
const securityHeaders = (() => {
  // In development mode, use a more relaxed CSP to allow local development
  if (process.env.NODE_ENV !== 'production') {
    return helmet({
      contentSecurityPolicy: false, // Disable CSP in development
      crossOriginEmbedderPolicy: false, // Disable COEP in development
      crossOriginOpenerPolicy: false, // Disable COOP in development
      crossOriginResourcePolicy: false, // Disable CORP in development
    });
  }
  
  // In production, use strict CSP
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "*.openai.com"],
      },
    },
  });
})();

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests, please try again later.',
    details: 'You have exceeded the rate limit for API requests.'
  },
  // Skip rate limiting in development mode
  skip: (req) => process.env.NODE_ENV !== 'production'
});

// Stricter rate limiter for more sensitive endpoints
const scanLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 scan requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many book scans, please try again later.',
    details: 'You have exceeded the rate limit for book scanning. Try again in an hour.'
  },
  // Skip rate limiting in development mode
  skip: (req) => process.env.NODE_ENV !== 'production'
});

module.exports = {
  securityHeaders,
  apiLimiter,
  scanLimiter
};