/**
 * DETAILED BACKEND TEST
 * - Uses gmail.com only
 * - No dots in email
 * - Prints ALL fields clearly
 * - Shows exact error messages
 */
const https = require('https');

const BASE_HOST = 'texcult-backend-latest-1.onrender.com';
const BASE_PATH = '/texcultv1';

// Generate random number for unique values
const random = () => Math.floor(100000 + Math.random() * 900000);

function makeRequest(path, method, body = null) {
    return new Promise((resolve) => {
        console.log('');
        console.log('>>> SENDING REQUEST <<<');
        console.log('URL: https://' + BASE_HOST + path);
        console.log('Method: ' + method);
        if (body) {
            console.log('Body (JSON):');
            const parsed = JSON.parse(body);
            Object.keys(parsed).forEach(key => {
                console.log('  ' + key + ': "' + parsed[key] + '"');
            });
        }
        console.log('');
        console.log('>>> WAITING FOR RESPONSE... <<<');

        const req = https.request({
            hostname: BASE_HOST,
            path: path,
            method: method,
            headers: body ? { 'Content-Type': 'application/json' } : {}
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('');
                console.log('>>> RESPONSE RECEIVED <<<');
                console.log('Status Code: ' + res.statusCode);
                console.log('Status Text: ' + res.statusMessage);
                console.log('Response Body: ' + data);

                // Parse and show error if exists
                try {
                    const json = JSON.parse(data);
                    if (json.message) {
                        console.log('');
                        console.log('>>> ERROR MESSAGE: ' + json.message + ' <<<');
                    }
                    if (json.code) {
                        console.log('>>> ERROR CODE: ' + json.code + ' <<<');
                    }
                } catch (e) { }

                resolve({ status: res.statusCode, body: data });
            });
        });

        req.on('error', e => {
            console.log('>>> NETWORK ERROR: ' + e.message + ' <<<');
            resolve({ status: 0, body: e.message });
        });

        req.setTimeout(60000, () => {
            console.log('>>> TIMEOUT: Request took more than 60 seconds <<<');
            req.destroy();
            resolve({ status: 0, body: 'Timeout' });
        });

        if (body) req.write(body);
        req.end();
    });
}

async function runTest() {
    // Generate unique random values
    const uniqueId = random();

    // Test user data - ALL RANDOM, gmail only, no dots
    const testUser = {
        username: 'testuser' + uniqueId + '@gmail.com',
        password: 'TestPass' + uniqueId,
        firstname: 'TestFirst' + uniqueId,
        lastname: 'TestLast' + uniqueId,
        companyName: 'TestCompany' + uniqueId,
        phoneno: '+91' + (7000000000 + Math.floor(Math.random() * 2999999999)),
        buyerType: 'RETAILER'
    };

    console.log('═'.repeat(70));
    console.log('          DETAILED BACKEND TEST - ' + new Date().toISOString());
    console.log('═'.repeat(70));
    console.log('');
    console.log('HOW THIS TEST WORKS:');
    console.log('1. I create a Node.js script on your computer');
    console.log('2. The script sends HTTP requests to the backend server');
    console.log('3. The backend server is at: https://' + BASE_HOST);
    console.log('4. I test the SIGNUP endpoint: POST /user/action/signup');
    console.log('5. I test the LOGIN endpoint: POST /user/action/login');
    console.log('6. I print EVERY field and EVERY response');
    console.log('');

    // ========== TEST 1: SIGNUP ==========
    console.log('═'.repeat(70));
    console.log('TEST 1: SIGNUP NEW USER');
    console.log('═'.repeat(70));
    console.log('');
    console.log('ALL FIELDS BEING SENT:');
    console.log('─'.repeat(50));
    console.log('  username (email): ' + testUser.username);
    console.log('  password:         ' + testUser.password);
    console.log('  firstname:        ' + testUser.firstname);
    console.log('  lastname:         ' + testUser.lastname);
    console.log('  companyName:      ' + testUser.companyName);
    console.log('  phoneno:          ' + testUser.phoneno);
    console.log('  buyerType:        ' + testUser.buyerType);
    console.log('─'.repeat(50));

    const signupResult = await makeRequest(
        BASE_PATH + '/user/action/signup',
        'POST',
        JSON.stringify(testUser)
    );

    console.log('');
    if (signupResult.status === 200 || signupResult.status === 201) {
        console.log('✅ SIGNUP TEST: SUCCESS');
    } else if (signupResult.status === 500) {
        console.log('❌ SIGNUP TEST: FAILED (Server Error 500)');
    } else if (signupResult.status === 0) {
        console.log('❌ SIGNUP TEST: FAILED (Network Error / Timeout)');
    } else {
        console.log('⚠️ SIGNUP TEST: UNEXPECTED STATUS ' + signupResult.status);
    }

    // ========== TEST 2: LOGIN ==========
    console.log('');
    console.log('═'.repeat(70));
    console.log('TEST 2: LOGIN WITH SAME USER');
    console.log('═'.repeat(70));
    console.log('');
    console.log('ALL FIELDS BEING SENT:');
    console.log('─'.repeat(50));
    console.log('  username (email): ' + testUser.username);
    console.log('  password:         ' + testUser.password);
    console.log('─'.repeat(50));

    const loginData = {
        username: testUser.username,
        password: testUser.password
    };

    const loginResult = await makeRequest(
        BASE_PATH + '/user/action/login',
        'POST',
        JSON.stringify(loginData)
    );

    console.log('');
    if (loginResult.status === 200) {
        console.log('✅ LOGIN TEST: SUCCESS');
    } else if (loginResult.status === 500) {
        console.log('❌ LOGIN TEST: FAILED (Server Error 500)');
    } else if (loginResult.status === 401 || loginResult.status === 400) {
        console.log('⚠️ LOGIN TEST: Invalid credentials (expected if signup failed)');
    } else {
        console.log('❌ LOGIN TEST: FAILED (Status ' + loginResult.status + ')');
    }

    // ========== FINAL SUMMARY ==========
    console.log('');
    console.log('═'.repeat(70));
    console.log('          FINAL SUMMARY');
    console.log('═'.repeat(70));
    console.log('');
    console.log('Signup Status: ' + signupResult.status);
    console.log('Login Status:  ' + loginResult.status);
    console.log('');

    if (signupResult.status === 200 && loginResult.status === 200) {
        console.log('🎉 BACKEND IS WORKING! Both signup and login succeeded.');
    } else {
        console.log('🔴 BACKEND HAS ISSUES.');
        console.log('');
        console.log('The error messages above tell you exactly what went wrong.');
    }
}

runTest();
