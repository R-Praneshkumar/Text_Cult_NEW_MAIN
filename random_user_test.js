/**
 * BACKEND TEST WITH RANDOM REALISTIC USERS
 * Tests signup and login with realistic email formats
 */
const https = require('https');

const BASE_HOST = 'texcult-backend-latest-1.onrender.com';
const BASE_PATH = '/texcultv1';

// Generate random realistic names
const firstNames = ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'James', 'Anna'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller'];
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomUser() {
    const firstName = randomPick(firstNames);
    const lastName = randomPick(lastNames);
    const randomNum = Math.floor(Math.random() * 9999);
    const domain = randomPick(domains);

    return {
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`,
        password: 'SecurePass123!',
        firstName: firstName,
        lastName: lastName,
        company: `${lastName} Enterprises`,
        phone: `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`
    };
}

function makeRequest(path, method, body = null) {
    return new Promise((resolve) => {
        const req = https.request({
            hostname: BASE_HOST,
            path: path,
            method: method,
            headers: body ? { 'Content-Type': 'application/json' } : {}
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', e => resolve({ status: 0, body: e.message }));
        req.setTimeout(30000, () => { req.destroy(); resolve({ status: 0, body: 'Timeout' }); });
        if (body) req.write(body);
        req.end();
    });
}

async function runTests() {
    console.log('═'.repeat(60));
    console.log('  BACKEND TEST WITH RANDOM REALISTIC USERS');
    console.log('  ' + new Date().toISOString());
    console.log('═'.repeat(60));
    console.log('');

    // Generate 3 random users
    const user1 = generateRandomUser();
    const user2 = generateRandomUser();
    const user3 = generateRandomUser();

    console.log('Generated Test Users:');
    console.log('  User 1: ' + user1.email);
    console.log('  User 2: ' + user2.email);
    console.log('  User 3: ' + user3.email);
    console.log('');

    // Test 1: Signup User 1
    console.log('─'.repeat(60));
    console.log('TEST 1: Signup - ' + user1.email);
    console.log('─'.repeat(60));

    const signup1 = await makeRequest(BASE_PATH + '/user/action/signup', 'POST', JSON.stringify({
        username: user1.email,
        password: user1.password,
        firstname: user1.firstName,
        lastname: user1.lastName,
        companyName: user1.company,
        phoneno: user1.phone,
        buyerType: 'RETAILER'
    }));

    console.log('Status: ' + signup1.status);
    console.log('Response: ' + signup1.body);
    console.log('Result: ' + (signup1.status === 200 || signup1.status === 201 ? '✅ SUCCESS' : '❌ FAILED'));
    console.log('');

    // Test 2: Signup User 2
    console.log('─'.repeat(60));
    console.log('TEST 2: Signup - ' + user2.email);
    console.log('─'.repeat(60));

    const signup2 = await makeRequest(BASE_PATH + '/user/action/signup', 'POST', JSON.stringify({
        username: user2.email,
        password: user2.password,
        firstname: user2.firstName,
        lastname: user2.lastName,
        companyName: user2.company,
        phoneno: user2.phone,
        buyerType: 'WHOLESALER'
    }));

    console.log('Status: ' + signup2.status);
    console.log('Response: ' + signup2.body);
    console.log('Result: ' + (signup2.status === 200 || signup2.status === 201 ? '✅ SUCCESS' : '❌ FAILED'));
    console.log('');

    // Test 3: Login User 1
    console.log('─'.repeat(60));
    console.log('TEST 3: Login - ' + user1.email);
    console.log('─'.repeat(60));

    const login1 = await makeRequest(BASE_PATH + '/user/action/login', 'POST', JSON.stringify({
        username: user1.email,
        password: user1.password
    }));

    console.log('Status: ' + login1.status);
    console.log('Response: ' + login1.body);
    console.log('Result: ' + (login1.status === 200 ? '✅ SUCCESS' : '❌ FAILED'));
    console.log('');

    // Test 4: Signup User 3 with different buyerType
    console.log('─'.repeat(60));
    console.log('TEST 4: Signup - ' + user3.email + ' (MANUFACTURER)');
    console.log('─'.repeat(60));

    const signup3 = await makeRequest(BASE_PATH + '/user/action/signup', 'POST', JSON.stringify({
        username: user3.email,
        password: user3.password,
        firstname: user3.firstName,
        lastname: user3.lastName,
        companyName: user3.company,
        phoneno: user3.phone,
        buyerType: 'MANUFACTURER'
    }));

    console.log('Status: ' + signup3.status);
    console.log('Response: ' + signup3.body);
    console.log('Result: ' + (signup3.status === 200 || signup3.status === 201 ? '✅ SUCCESS' : '❌ FAILED'));
    console.log('');

    // Summary
    console.log('═'.repeat(60));
    console.log('  SUMMARY');
    console.log('═'.repeat(60));

    const allPassed = [signup1, signup2, login1, signup3].every(r => r.status === 200 || r.status === 201);

    if (allPassed) {
        console.log('🎉 ALL TESTS PASSED - Backend is WORKING!');
    } else {
        console.log('❌ SOME TESTS FAILED - Backend has issues');
        console.log('');
        console.log('Signup 1: ' + (signup1.status === 200 || signup1.status === 201 ? '✅' : '❌ ' + signup1.status));
        console.log('Signup 2: ' + (signup2.status === 200 || signup2.status === 201 ? '✅' : '❌ ' + signup2.status));
        console.log('Login 1:  ' + (login1.status === 200 ? '✅' : '❌ ' + login1.status));
        console.log('Signup 3: ' + (signup3.status === 200 || signup3.status === 201 ? '✅' : '❌ ' + signup3.status));
    }
}

runTests();
