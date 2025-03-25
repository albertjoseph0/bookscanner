# BookScanner

BookScanner is a web application that allows you to scan your bookshelf and automatically identify and catalog your books using AI. Simply upload a photo of your bookshelf, and the app will detect book titles and authors, then store them in your digital book collection.

## Features

- **AI-Powered Book Recognition**: Upload images of your bookshelf to automatically identify books
- **Digital Collection Management**: View, sort, and manage your growing book collection
- **Intuitive User Interface**: Simple interface for scanning and organizing books
- **Security Features**: API rate limiting, request validation, and security headers
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js & Express
- **Database**: SQLite (local) or Azure SQL Database (cloud)
- **AI Integration**: OpenAI GPT-4o Vision API
- **Security**: Helmet, express-rate-limit, express-validator

## Project Structure

The project follows a modern, modular architecture:

```
bookscanner/
├── backend/
│   ├── config/           # Configuration files
│   │   ├── db.js         # Database connection
│   │   └── env.js        # Environment variables
│   ├── controllers/      # Route handlers
│   │   └── bookController.js
│   ├── middleware/       # Middleware functions
│   │   ├── errorHandler.js
│   │   ├── security.js   # Security middleware
│   │   └── validation.js # Input validation
│   ├── models/           # Database models
│   │   └── Book.js
│   ├── routes/           # API routes
│   │   └── bookRoutes.js
│   ├── services/         # Business logic
│   │   └── openaiService.js
│   ├── uploads/          # Temporary storage for uploads
│   ├── .env              # Environment variables
│   ├── books.db          # SQLite database
│   └── server.js         # Entry point
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API client
│   │   └── App.js        # Main application component
│   ├── .env              # Environment variables
│   └── package.json      # Dependencies and scripts
└── start.sh              # Startup script
```

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- An OpenAI API key with access to GPT-4o Vision models

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd bookscanner
   ```

2. Install dependencies:
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   
   Copy the example environment file in the backend:
   ```
   cd backend
   cp .env.example .env
   ```
   
   Then update the `.env` file with your settings:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NODE_ENV=development
   USE_AZURE_DB=false  # Set to true to use Azure SQL Database
   ```

   In the `frontend/.env` file:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

### Running the Application

Use the provided start script to launch both frontend and backend:

```
./start.sh
```

This script will:
1. Kill any processes running on ports 3000 and 3001
2. Start the backend server
3. Start the frontend development server
4. Clean up processes when you're done

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage

1. **Scan Books**:
   - Click "Choose File" to select an image of your bookshelf
   - Click "Scan Bookshelf" to process the image
   - The AI will identify book titles and authors and add them to your collection

2. **Manage Collection**:
   - View all your books in the "Your Book Collection" section
   - Sort books by title, author, or date added
   - Remove books with the "Remove" button

## Development

### Key Components

- **Frontend**:
  - `useBooks` hook manages book data and API interactions
  - Component-based architecture for maintainability
  - API service for backend communication

- **Backend**:
  - RESTful API for book management
  - OpenAI integration for image processing
  - SQLite for data persistence

### API Endpoints

- `GET /api/books` - Get all books in the collection
- `POST /api/scan` - Upload and process a bookshelf image
- `DELETE /api/books/:id` - Delete a book by ID

### Security Features

BookScanner implements several security measures to protect against abuse:

1. **API Rate Limiting**:
   - Global limit: 100 requests per 15 minutes per IP address
   - Scan endpoint limit: 10 requests per hour per IP address

2. **Input Validation**:
   - File uploads are validated for type, size, and content
   - Route parameters are validated for proper format
   - Request bodies are validated for required fields

3. **Security Headers**:
   - Content Security Policy to prevent XSS attacks
   - Protection against clickjacking
   - XSS protection headers

4. **Error Handling**:
   - Sanitized error messages in production
   - No leakage of sensitive information
   - Proper HTTP status codes

5. **CORS Protection**:
   - Restricted to known frontend origins
   - Limited HTTP methods
   - Limited allowed headers

6. **File Upload Security**:
   - Size limits (5MB max)
   - Type validation (images only)
   - Secure filename generation
   - Automatic cleanup after processing

## Database Configuration

### Azure SQL Database Setup

The application supports both SQLite (default) and Azure SQL Database. To use Azure SQL:

1. Create an Azure SQL Database in the Azure Portal
2. Copy `.env.example` to `.env` in the backend directory
3. Update the following variables in your `.env` file:
   ```
   USE_AZURE_DB=true
   AZURE_SQL_SERVER=your-server.database.windows.net
   AZURE_SQL_DATABASE=your-database-name
   AZURE_SQL_USER=your-username
   AZURE_SQL_PASSWORD=your-password
   ```

4. Migrate your existing data (optional):
   ```
   cd backend
   npm run migrate
   ```

5. Run the application with Azure SQL:
   ```
   npm run use:azure
   ```

To switch back to SQLite, set `USE_AZURE_DB=false` in your `.env` file or run:
```
npm run use:sqlite
```

## Future Improvements

- Add user authentication
- Implement book categories/tags
- Add search functionality
- Enable book metadata editing
- Support for exporting/importing book collections

## License

This project is licensed under the MIT License - see the LICENSE file for details.