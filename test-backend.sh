#!/bin/bash

echo "🚀 Testing ChaseMyCareer Backend API"
echo "===================================="
echo ""

# Start backend in background
cd /workspace/chasemycareer/backend-api
echo "📦 Starting backend server..."
npm run dev > /tmp/backend-test.log 2>&1 &
BACKEND_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Test health endpoint
echo ""
echo "🏥 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/health)

if [ $? -eq 0 ]; then
    echo "✅ Health check passed!"
    echo "Response: $HEALTH_RESPONSE"
else
    echo "❌ Health check failed!"
    echo "Check logs: cat /tmp/backend-test.log"
fi

# Kill backend
echo ""
echo "🛑 Stopping backend server..."
kill $BACKEND_PID 2>/dev/null

echo ""
echo "✅ Test complete!"
