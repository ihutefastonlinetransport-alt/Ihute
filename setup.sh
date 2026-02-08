#!/bin/bash

echo "🚀 IHUTE Setup Script"
echo "===================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Install from https://nodejs.org/"
    exit 1
fi

# Setup backend
echo "📦 Setting up backend..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env file. Please edit with your database credentials."
fi

cd ..

# Setup frontend
echo "📦 Setting up frontend..."
cd client
if [ ! -d "node_modules" ]; then
    npm install
fi

# Create .env.local if not exists
if [ ! -f ".env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env with your database credentials"
echo "2. Run 'npm run migrate' in the server directory"
echo "3. Run 'npm run dev' in server/ (in one terminal)"
echo "4. Run 'npm run dev' in client/ (in another terminal)"
echo ""
echo "Then open http://localhost:3000"
