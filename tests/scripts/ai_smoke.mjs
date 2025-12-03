#!/usr/bin/env node

const publicDomain = process.env.PUBLIC_DOMAIN;
const aiTestEndpoint = process.env.AI_TEST_ENDPOINT;

// Configurable response key to check
const EXPECTED_RESPONSE_KEY = 'data'; // Change this to match your API response structure

if (!publicDomain || !aiTestEndpoint) {
    console.error('❌ PUBLIC_DOMAIN and AI_TEST_ENDPOINT must be set');
    process.exit(1);
}

async function testAIEndpoint() {
    const url = `https://${publicDomain}${aiTestEndpoint}`;
    
    console.log('🤖 Testing AI endpoint...');
    console.log(`📡 Endpoint: ${aiTestEndpoint}`);
    
    // Minimal test payload
    const testPayload = {
        prompt: "test",
        max_tokens: 10
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testPayload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ AI endpoint responded successfully');

        // Check for expected response structure
        if (data && typeof data === 'object') {
            if (data[EXPECTED_RESPONSE_KEY] !== undefined) {
                console.log(`✅ Expected response key '${EXPECTED_RESPONSE_KEY}' found`);
            } else {
                console.log(`⚠️  Expected response key '${EXPECTED_RESPONSE_KEY}' not found`);
                console.log('📋 Available keys:', Object.keys(data));
            }
        } else {
            console.log('⚠️  Response is not a JSON object');
        }

        console.log('✅ AI endpoint test completed successfully');

    } catch (error) {
        console.error('❌ AI endpoint test failed:', error.message);
        process.exit(1);
    }
}

testAIEndpoint();