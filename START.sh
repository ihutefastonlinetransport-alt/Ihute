#!/bin/bash

# IHUTE - Quick Start Commands
# Copy and paste these commands to your terminal

echo "🚀 IHUTE Quick Start"
echo "===================="
echo ""

# Navigate to project
echo "📂 Navigating to project..."
cd /workspaces/Ihute

# Option 1: Docker (Recommended - One Command)
echo ""
echo "Option 1: Docker (Easiest - One Command)"
echo "=========================================="
echo "Run this single command:"
echo ""
echo "  docker-compose up -d"
echo ""
echo "Then open:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""

# Option 2: Manual Setup
echo "Option 2: Manual Setup (If Docker not available)"
echo "================================================="
echo ""
echo "Terminal 1 - Backend:"
echo "  cd server"
echo "  npm install"
echo "  cp .env.example .env"
echo "  # Edit .env with database credentials"
echo "  npm start"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd client"
echo "  npm install"
echo "  npm run dev"
echo ""

# Test API
echo "Test Backend API:"
echo "================="
echo ""
echo "  curl http://localhost:3001/health"
echo ""

# View your changes
echo "View the built system:"
echo "===================="
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  Admin:    http://localhost:3000/admin"
echo "  Login:    http://localhost:3000/login"
echo ""

# File structure
echo "Important Files:"
echo "==============="
echo "  Core Logic:       server/src/routes/"
echo "  Frontend Pages:   client/src/pages/"
echo "  Database:         server/migrations/001_init_schema.sql"
echo "  Documentation:    README.md, QUICKSTART.md"
echo ""

# Database setup
echo "Database Setup (If running manually):"
echo "====================================="
echo ""
echo "  # Create database"
echo "  createdb -U postgres ihute_db"
echo ""
echo "  # Run migrations"
echo "  psql -U postgres -d ihute_db -f server/migrations/001_init_schema.sql"
echo ""

# Stop services
echo "Stop all services:"
echo "================="
echo "  docker-compose down"
echo ""

# View logs
echo "View logs:"
echo "========="
echo "  docker-compose logs -f backend"
echo "  docker-compose logs -f frontend"
echo ""

# Test the app
echo "Test the application:"
echo "===================="
echo ""
echo "As a Passenger:"
echo "  1. Go to http://localhost:3000"
echo "  2. Click 'Book Now'"
echo "  3. Search for trips"
echo "  4. Complete booking"
echo ""
echo "As an Admin:"
echo "  1. Go to http://localhost:3000/login"
echo "  2. Select 'Admin'"
echo "  3. Use test credentials (you'll need to create)"
echo ""
echo "As a Driver:"
echo "  1. Go to http://localhost:3000/login"
echo "  2. Click 'Register here'"
echo "  3. Register & login"
echo ""

echo ""
echo "✅ Ready to go! Choose Option 1 or 2 above."
echo ""
