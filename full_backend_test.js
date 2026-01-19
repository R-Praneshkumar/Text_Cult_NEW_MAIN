/**
 * COMPREHENSIVE BACKEND TEST SUITE
 * Tests: Signup, Login, Multiple Users
 * Date: 19 Jan 2026
 */
const https = require('https');

const BASE_HOST = 'texcult-backend-latest-1.onrender.com';
const BASE_PATH = '/texcultv1';

function makeRequest(config, body = null) {
    return new Promise((resolve) => {
        const options = {
            hostname: BASE_HOST,
            path: config.path,
            method: config.method,
            headers: body ? { 'Content-Type': 'application/json' } : {}
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    body: data
                });
            });
        });

        req.on('error', e => resolve({ status: 0, statusText: 'Error', body: e.message }));
        req.setTimeout(30000, () => {
            req.destroy();
            resolve({ status: 0, statusText: 'Timeout', body: 'Request timed out after 30s' });
        });

        if (body) req.write(body);
        req.end();
    });
}

async function runTests() {
    const timestamp = Date.now();
    const testEmail1 = `multitest.user1.${timestamp}@example.com`;
    const testEmail2 = `multitest.user2.${timestamp}@example.com`;
    const testPassword = 'Password123!';

    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║          COMPREHENSIVE BACKEND TEST SUITE                    ║');
    console.log('║          ' + new Date().toISOString() + '                    ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Target: https://' + BASE_HOST + BASE_PATH);
    console.log('');

    // ============ TEST 1: Server Reachability ============
    console.log('━'.repeat(60));
    console.log('TEST 1: Server Reachability');
    console.log('━'.repeat(60));
    console.log('Request: GET ' + BASE_PATH);

    const test1 = await makeRequest({ path: BASE_PATH, method: 'GET' });
    console.log('Response: ' + test1.status + ' ' + test1.statusText);

    if (test1.status === 302 || test1.status === 200) {
        console.log('Result: ✅ Server is REACHABLE');
    } else if (test1.status === 0) {
        console.log('Result: ❌ Server is DOWN or unreachable');
    } else {
        console.log('Result: ⚠️ Unexpected response');
    }
    console.log('');

    // ============ TEST 2: Signup User 1 ============
    console.log('━'.repeat(60));
    console.log('TEST 2: Signup New User #1');
    console.log('━'.repeat(60));
    console.log('Email: ' + testEmail1);
    console.log('Password: ' + testPassword);

    const signupData1 = JSON.stringify({
        username: testEmail1,
        password: testPassword,
        firstname: 'Test',
        lastname: 'User1',
        companyName: 'TestCorp1',
        phoneno: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        buyerType: 'RETAILER'
    });

    const test2 = await makeRequest({ path: BASE_PATH + '/user/action/signup', method: 'POST' }, signupData1);
    console.log('Response: ' + test2.status + ' ' + test2.statusText);
    console.log('Body: ' + test2.body);

    let user1Created = false;
    if (test2.status === 200 || test2.status === 201) {
        console.log('Result: ✅ User #1 CREATED successfully!');
        user1Created = true;
    } else if (test2.status === 500) {
        console.log('Result: ❌ Server ERROR - Database issue');
    } else if (test2.status === 400) {
        console.log('Result: ⚠️ Bad request - Check data format');
    } else {
        console.log('Result: ❓ Unexpected status: ' + test2.status);
    }
    console.log('');

    // ============ TEST 3: Signup User 2 ============
    console.log('━'.repeat(60));
    console.log('TEST 3: Signup New User #2');
    console.log('━'.repeat(60));
    console.log('Email: ' + testEmail2);
    console.log('Password: ' + testPassword);

    const signupData2 = JSON.stringify({
        username: testEmail2,
        password: testPassword,
        firstname: 'Test',
        lastname: 'User2',
        companyName: 'TestCorp2',
        phoneno: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        buyerType: 'WHOLESALER'
    });

    const test3 = await makeRequest({ path: BASE_PATH + '/user/action/signup', method: 'POST' }, signupData2);
    console.log('Response: ' + test3.status + ' ' + test3.statusText);
    console.log('Body: ' + test3.body);

    let user2Created = false;
    if (test3.status === 200 || test3.status === 201) {
        console.log('Result: ✅ User #2 CREATED successfully!');
        user2Created = true;
    } else if (test3.status === 500) {
        console.log('Result: ❌ Server ERROR - Database issue');
    } else {
        console.log('Result: ❓ Status: ' + test3.status);
    }
    console.log('');

    // ============ TEST 4: Login User 1 ============
    console.log('━'.repeat(60));
    console.log('TEST 4: Login with User #1');
    console.log('━'.repeat(60));
    console.log('Email: ' + testEmail1);
    console.log('Password: ' + testPassword);

    const loginData1 = JSON.stringify({
        username: testEmail1,
        password: testPassword
    });

    const test4 = await makeRequest({ path: BASE_PATH + '/user/action/login', method: 'POST' }, loginData1);
    console.log('Response: ' + test4.status + ' ' + test4.statusText);
    console.log('Body: ' + test4.body);

    if (test4.status === 200) {
        console.log('Result: ✅ Login SUCCESSFUL!');
    } else if (test4.status === 500) {
        console.log('Result: ❌ Server ERROR');
    } else if (test4.status === 401 || test4.status === 400) {
        console.log('Result: ⚠️ Login failed - Invalid credentials or user not found');
    } else {
        console.log('Result: ❓ Status: ' + test4.status);
    }
    console.log('');

    // ============ TEST 5: Login with Wrong Password ============
    console.log('━'.repeat(60));
    console.log('TEST 5: Login with WRONG Password');
    console.log('━'.repeat(60));
    console.log('Email: ' + testEmail1);
    console.log('Password: wrongpassword');

    const loginDataWrong = JSON.stringify({
        username: testEmail1,
        password: 'wrongpassword'
    });

    const test5 = await makeRequest({ path: BASE_PATH + '/user/action/login', method: 'POST' }, loginDataWrong);
    console.log('Response: ' + test5.status + ' ' + test5.statusText);
    console.log('Body: ' + test5.body);

    if (test5.status === 401 || test5.status === 400) {
        console.log('Result: ✅ Correctly rejected wrong password');
    } else if (test5.status === 500) {
        console.log('Result: ❌ Server ERROR instead of rejecting');
    } else {
        console.log('Result: ❓ Status: ' + test5.status);
    }
    console.log('');

    // ============ TEST 6: Login Non-existent User ============
    console.log('━'.repeat(60));
    console.log('TEST 6: Login with Non-existent User');
    console.log('━'.repeat(60));
    console.log('Email: doesnotexist@example.com');

    const loginDataNonExist = JSON.stringify({
        username: 'doesnotexist@example.com',
        password: 'anypassword'
    });

    const test6 = await makeRequest({ path: BASE_PATH + '/user/action/login', method: 'POST' }, loginDataNonExist);
    console.log('Response: ' + test6.status + ' ' + test6.statusText);
    console.log('Body: ' + test6.body);

    if (test6.status === 404 || test6.status === 400 || test6.status === 401) {
        console.log('Result: ✅ Correctly reported user not found');
    } else if (test6.status === 500) {
        console.log('Result: ❌ Server ERROR - Database connection issue');
    } else {
        console.log('Result: ❓ Status: ' + test6.status);
    }
    console.log('');

    // ============ FINAL SUMMARY ============
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    FINAL SUMMARY                             ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');

    const signupWorks = (test2.status === 200 || test2.status === 201);
    const loginWorks = (test4.status === 200);
    const dbWorks = (test6.status !== 500);

    console.log('');
    console.log('Server Reachable:     ' + (test1.status > 0 ? '✅ YES' : '❌ NO'));
    console.log('Signup Works:         ' + (signupWorks ? '✅ YES' : '❌ NO'));
    console.log('Login Works:          ' + (loginWorks ? '✅ YES' : '❌ NO'));
    console.log('Database Connected:   ' + (dbWorks ? '✅ YES' : '❌ NO'));
    console.log('');

    if (signupWorks && loginWorks && dbWorks) {
        console.log('🎉 BACKEND IS FULLY WORKING! You can use the app now.');
    } else if (test1.status === 0) {
        console.log('🔴 BACKEND IS DOWN - Server not reachable.');
    } else {
        console.log('🔴 BACKEND HAS ISSUES - Check individual test results above.');
    }
}

runTests();
