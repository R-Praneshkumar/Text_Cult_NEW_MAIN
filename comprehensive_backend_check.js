/**
 * COMPREHENSIVE BACKEND STATUS CHECK
 * This script tests all endpoints and explains what each result means.
 */

const https = require('https');

const BASE_HOST = 'texcult-backend-latest-1.onrender.com';
const BASE_PATH = '/texcultv1';

function makeRequest(name, method, path, body = null) {
    return new Promise((resolve) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`TEST: ${name}`);
        console.log(`${'='.repeat(60)}`);
        console.log(`Method: ${method}`);
        console.log(`URL: https://${BASE_HOST}${path}`);
        if (body) console.log(`Body: ${body}`);
        console.log(`---`);

        const options = {
            hostname: BASE_HOST,
            path: path,
            method: method,
            headers: body ? { 'Content-Type': 'application/json' } : {}
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`RESPONSE STATUS: ${res.statusCode} ${res.statusMessage}`);
                console.log(`RESPONSE BODY: ${data || '(empty)'}`);

                // Interpret the result
                console.log(`---`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`✅ INTERPRETATION: SUCCESS - The request worked as expected.`);
                } else if (res.statusCode === 400) {
                    console.log(`⚠️ INTERPRETATION: BAD REQUEST - Server rejected our input (but server is working).`);
                } else if (res.statusCode === 401) {
                    console.log(`⚠️ INTERPRETATION: UNAUTHORIZED - Needs authentication (but server is working).`);
                } else if (res.statusCode === 404) {
                    console.log(`⚠️ INTERPRETATION: NOT FOUND - Endpoint or resource doesn't exist (but server is working).`);
                } else if (res.statusCode === 500) {
                    console.log(`❌ INTERPRETATION: SERVER ERROR - Something crashed on the server side!`);
                    console.log(`   This is NOT a client problem. The server's database or code is broken.`);
                } else {
                    console.log(`❓ INTERPRETATION: Unexpected status code ${res.statusCode}.`);
                }
                resolve({ status: res.statusCode, body: data });
            });
        });

        req.on('error', (e) => {
            console.log(`❌ NETWORK ERROR: ${e.message}`);
            console.log(`   Could not reach the server at all. Check internet connection.`);
            resolve({ status: 0, body: e.message });
        });

        req.setTimeout(30000, () => {
            console.log(`❌ TIMEOUT: Server took too long to respond (>30s).`);
            req.destroy();
            resolve({ status: 0, body: 'Timeout' });
        });

        if (body) req.write(body);
        req.end();
    });
}

async function runAllTests() {
    console.log(`\n${'#'.repeat(60)}`);
    console.log(`# BACKEND HEALTH CHECK - ${new Date().toISOString()}`);
    console.log(`# Target: https://${BASE_HOST}${BASE_PATH}`);
    console.log(`${'#'.repeat(60)}`);

    // Test 1: Can we reach the server at all?
    const test1 = await makeRequest(
        '1. Server Reachability (Root Path)',
        'GET',
        BASE_PATH
    );

    // Test 2: Login with INVALID credentials
    // If server is healthy: Should return 400/401 (Bad credentials) or 404 (User not found)
    // If server is broken: Will return 500
    const test2 = await makeRequest(
        '2. Login Endpoint (with fake user - tests DB connection)',
        'POST',
        `${BASE_PATH}/user/action/login`,
        JSON.stringify({
            username: "nonexistent.user.check@example.com",
            password: "wrongpassword123"
        })
    );

    // Test 3: Signup with fresh user
    const timestamp = Date.now();
    const test3 = await makeRequest(
        '3. Signup Endpoint (fresh user - tests DB write)',
        'POST',
        `${BASE_PATH}/user/action/signup`,
        JSON.stringify({
            username: `check.user.${timestamp}@example.com`,
            password: "password123",
            firstname: "Check",
            lastname: "User",
            companyName: "CheckCompany",
            phoneno: `+91${Math.floor(Math.random() * 10000000000)}`,
            buyerType: "RETAILER"
        })
    );

    // Summary
    console.log(`\n${'#'.repeat(60)}`);
    console.log(`# FINAL VERDICT`);
    console.log(`${'#'.repeat(60)}`);

    const allPassed = test2.status !== 500 && test3.status !== 500;

    if (allPassed) {
        console.log(`\n✅ BACKEND IS WORKING`);
        console.log(`   The server responded correctly to all tests.`);
        console.log(`   If your app still shows errors, the problem is in the app code.`);
    } else {
        console.log(`\n❌ BACKEND IS BROKEN`);
        console.log(`   The server returned 500 errors.`);
        console.log(`   This means the DATABASE CONNECTION is likely down.`);
        console.log(`   The app cannot work until the server is fixed.`);
    }
}

runAllTests();
