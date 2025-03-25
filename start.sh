#!/bin/bash

# First, check if anything is running on port 3000 or 3001 and kill it
echo "Checking for existing processes..."
kill_process_on_port() {
  local port=$1
  local pid=$(lsof -t -i :$port)
  if [ -n "$pid" ]; then
    echo "Killing process $pid on port $port"
    kill -9 $pid
    sleep 1
  fi
}

kill_process_on_port 3000
kill_process_on_port 3001

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
PORT=3000 npm start || PORT=3002 npm start

# When frontend is stopped, also stop the backend
kill $BACKEND_PID
echo "Backend server stopped"