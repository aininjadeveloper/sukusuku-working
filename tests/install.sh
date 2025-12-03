#!/bin/bash

echo "🔧 Installing CI test dependencies..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Install Playwright with dependencies
echo "📦 Installing Playwright..."
npx playwright install --with-deps

# Install autocannon for load testing
echo "📦 Installing autocannon..."
npm install -g autocannon

# Check if psql is available (for database tests)
if ! command -v psql &> /dev/null; then
    echo "⚠️  psql not found. Database tests may fail."
    echo "   Install postgresql-client package on your system."
else
    echo "✅ psql found"
fi

# Install curl if not present
if ! command -v curl &> /dev/null; then
    echo "❌ curl not found. Please install curl."
    exit 1
fi

echo "✅ All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Copy tests/.env.ci.sample to tests/.env"
echo "2. Edit tests/.env with your configuration"
echo "3. Run: bash tests/run_all.sh"