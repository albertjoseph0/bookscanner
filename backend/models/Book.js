// Book model
const { v4: uuidv4 } = require('uuid');

/**
 * Book class representing a book entity
 */
class Book {
  /**
   * Create a new Book instance
   * @param {Object} data - Book data
   * @param {string} [data.bookId] - Unique ID for the book (generated if not provided)
   * @param {string} data.title - Book title
   * @param {string} data.author - Book author
   * @param {string} [data.dateAdded] - Date the book was added (defaults to now)
   */
  constructor({ bookId, title, author, dateAdded }) {
    this.bookId = bookId || uuidv4();
    this.title = title;
    this.author = author;
    this.dateAdded = dateAdded || new Date().toISOString();
  }

  /**
   * Create a Book instance from database row
   * @param {Object} row - Database row
   * @returns {Book} Book instance
   */
  static fromDbRow(row) {
    return new Book({
      bookId: row.bookId,
      title: row.title,
      author: row.author,
      dateAdded: row.dateAdded
    });
  }

  /**
   * Convert Book to object for database insertion
   * @returns {Object} Database-ready object
   */
  toDbObject() {
    return {
      bookId: this.bookId,
      title: this.title,
      author: this.author,
      dateAdded: this.dateAdded
    };
  }
}

module.exports = Book;