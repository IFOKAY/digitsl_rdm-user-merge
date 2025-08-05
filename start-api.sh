#!/bin/bash

echo "🚀 Starting IBM Skills Pro API Server..."

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🔧 Starting server on port 8082..."
echo "📝 Note: Using mock database for development"
echo "🌐 API will be available at: http://localhost:8082"
echo "📊 Health check: http://localhost:8082/health"
echo ""

npm start