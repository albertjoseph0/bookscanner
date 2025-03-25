#!/bin/bash

# Start backend server
echo "Starting BookScanner backend server..."
cd backend
node server.js &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Wait a moment for backend to initialize
sleep 2

# Start frontend server
echo "Starting BookScanner frontend..."
cd ../frontend
npm start

# When frontend is stopped, also stop the backend
kill $BACKEND_PID
echo "Backend server stopped"