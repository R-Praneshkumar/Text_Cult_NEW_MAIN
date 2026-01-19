/**
 * SIMPLE BACKEND CHECK - Clean Output
 */
const https = require('https');

const timestamp = Date.now();

console.log('='.repeat(60));
console.log('BACKEND CHECK - ' + new Date().toISOString());
console.log('='.repeat(60));

// Test Signup
const signupData = JSON.stringify({
    username: `test.${timestamp}@example.com`,
    password: "password123",
    firstname: "Test",
    lastname: "User",
    companyName: "TestCorp",
    phoneno: `+91${Math.floor(Math.random() * 10000000000)}`,
    buyerType: "RETAILER"
});

console.log('\n[TEST] Signup with fresh user...');
console.log('Email:', `test.${timestamp}@example.com`);

const req = https.request({
    hostname: 'texcult-backend-latest-1.onrender.com',
    path: '/texcultv1/user/action/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('\n[RESULT]');
        console.log('Status:', res.statusCode, res.statusMessage);
        console.log('Body:', data);

        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('\n✅ SUCCESS! Backend is WORKING!');
        } else if (res.statusCode === 500) {
            console.log('\n❌ FAILED! Backend returned 500 error.');
            console.log('   Database connection is likely broken.');
        } else {
            console.log('\n⚠️ Unexpected status:', res.statusCode);
        }
    });
});

req.on('error', e => console.log('ERROR:', e.message));
req.write(signupData);
req.end();
