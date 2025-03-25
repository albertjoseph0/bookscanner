// Book routes
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bookController = require('../controllers/bookController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Define routes
router.get('/books', bookController.getAllBooks);
router.post('/scan', upload.single('image'), bookController.processBookshelfImage);
router.delete('/books/:id', bookController.deleteBook);

module.exports = router;