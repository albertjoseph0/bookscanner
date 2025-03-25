// Validation middleware
const { param, validationResult } = require('express-validator');

/**
 * Validation rules for different routes
 */

// Validate book ID parameter
const validateBookId = [
  param('id')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Book ID is required')
    .isUUID()
    .withMessage('Invalid book ID format'),
];

/**
 * Middleware to check validation results
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: errors.array() 
    });
  }
  next();
};

/**
 * Middleware to validate file uploads
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateImageUpload = (req, res, next) => {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: 'No image file uploaded' 
    });
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: 'File type not supported. Please upload a JPG or PNG image.' 
    });
  }

  // Check file size (limit to 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxSize) {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: 'File too large. Maximum size is 5MB.' 
    });
  }

  next();
};

module.exports = {
  validateBookId,
  validateImageUpload,
  checkValidationResult
};