// Book routes
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bookController = require('../controllers/bookController');
const { validateBookId, validateImageUpload, checkValidationResult } = require('../middleware/validation');
const { scanLimiter } = require('../middleware/security');

const router = express.Router();

// Configure multer for file uploads with additional security settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a safe filename with timestamp and original extension
    const fileExtension = path.extname(file.originalname);
    const safeFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
    cb(null, safeFilename);
  }
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  // Only accept images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1 // Only 1 file per request
  }
});

// Define the scan middleware stack based on environment
const scanMiddleware = [];

// Only apply rate limiting in production
if (process.env.NODE_ENV === 'production') {
  scanMiddleware.push(scanLimiter);
}

// Add the common middleware for all environments
scanMiddleware.push(upload.single('image'));
scanMiddleware.push(validateImageUpload);

// Define routes with validation and conditional rate limiting
router.get('/books', bookController.getAllBooks);

router.post(
  '/scan', 
  scanMiddleware,
  bookController.processBookshelfImage
);

router.delete(
  '/books/:id', 
  validateBookId,
  checkValidationResult,
  bookController.deleteBook
);

module.exports = router;