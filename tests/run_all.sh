#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting Production Deployment Test Suite"
echo "============================================="

# Load environment variables
if [ -f "tests/.env" ]; then
    echo "📋 Loading tests/.env"
    export $(grep -v '^#' tests/.env | xargs)
else
    echo "📋 Loading tests/.env.ci.sample (fallback)"
    export $(grep -v '^#' tests/.env.ci.sample | xargs)
fi

# Initialize test results
FAILED_TESTS=()

# Function to run test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo ""
    echo "🧪 Testing: $test_name"
    echo "---"
    
    if eval "$test_command"; then
        echo "✅ $test_name - PASSED"
    else
        echo "❌ $test_name - FAILED"
        FAILED_TESTS+=("$test_name")
    fi
}

# 1. Health Check - Local Port
run_test "Local Health Check" "curl -f -s http://127.0.0.1:${NODE_PORT}${HEALTH_PATH} > /dev/null"

# 2. Health Check - Public Domain
run_test "Public Domain Health Check" "curl -f -s https://${PUBLIC_DOMAIN}${HEALTH_PATH} > /dev/null"

# 3. SSL Check
run_test "SSL Certificate Check" "curl -f -s -I https://${PUBLIC_DOMAIN} | grep -q 'HTTP/[12]'"

# 4. API Health Check (if configured)
if [ ! -z "$API_HEALTH" ]; then
    run_test "API Health Check" "curl -f -s https://${PUBLIC_DOMAIN}${API_HEALTH} > /dev/null"
fi

# 5. Database Connectivity
run_test "Database Connectivity" "node tests/scripts/db_check.mjs"

# 6. AI Endpoint Test (if configured)
if [ ! -z "$AI_TEST_ENDPOINT" ]; then
    run_test "AI Endpoint Test" "node tests/scripts/ai_smoke.mjs"
fi

# 7. Auth Flow E2E Test
run_test "Auth Flow E2E" "npx playwright test"

# 8. Load Test
run_test "Load Test (30s)" "npx autocannon -d 30 -c 20 https://${PUBLIC_DOMAIN}${HEALTH_PATH}"

# Final Summary
echo ""
echo "🏁 Test Summary"
echo "==============="

if [ ${#FAILED_TESTS[@]} -eq 0 ]; then
    echo "✅ All tests passed successfully!"
    echo "🎉 Production deployment is healthy!"
    exit 0
else
    echo "❌ Failed tests:"
    for test in "${FAILED_TESTS[@]}"; do
        echo "  - $test"
    done
    echo ""
    echo "💥 Production deployment has issues that need attention."
    exit 1
fi