# BookScanner

BookScanner is a web application that allows you to scan your bookshelf and automatically identify and catalog your books using AI. Simply upload a photo of your bookshelf, and the app will detect book titles and authors, then store them in your digital book collection.

## Features

- **Bookshelf Scanning**: Upload images of your bookshelf and use AI to identify books
- **Book Collection**: View and manage your growing book collection
- **Sorting**: Sort your books by title, author, or date added
- **Book Management**: Easily remove books from your collection

## Technical Stack

- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: SQLite
- **AI Vision**: OpenAI GPT-4o Vision API

## Project Structure

```
bookscanner/
├── backend/              # Backend server code
│   ├── server.js         # Express server
│   ├── books.db          # SQLite database
│   ├── uploads/          # Temporary storage for uploaded images
│   └── .env              # Environment variables
├── frontend/             # React frontend code
│   ├── public/           # Static assets
│   └── src/              # React source code
└── start.sh              # Script to start both servers
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)
- An OpenAI API key with access to the GPT-4o model

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd bookscanner
   ```

2. Install dependencies for both frontend and backend:
   ```
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `backend` directory if it doesn't exist
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     PORT=3001
     ```

### Running the Application

Use the provided start script to run both the frontend and backend servers:

```
./start.sh
```

Or run them separately:

1. Start the backend server:
   ```
   cd backend
   node server.js
   ```

2. In a separate terminal, start the frontend server:
   ```
   cd frontend
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage

1. Open the application in your browser at http://localhost:3000
2. Click "Choose File" to select an image of your bookshelf
3. Click "Scan Bookshelf" to analyze the image
4. View your detected books in the collection section
5. Sort books using the sort controls
6. Remove books with the "Remove" button

## API Endpoints

- `GET /api/books` - Get all books in the collection
- `POST /api/scan` - Upload and process a bookshelf image
- `DELETE /api/books/:id` - Delete a book by ID

## Troubleshooting

- If the app isn't working, make sure both servers are running correctly
- Check the console for any error messages
- Verify your OpenAI API key is correct and has access to GPT-4o
- Make sure ports 3000 and 3001 are available