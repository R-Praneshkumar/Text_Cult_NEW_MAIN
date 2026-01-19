const https = require('https');

const CHECK_1_HEALTH = {
    hostname: 'texcult-backend-latest-1.onrender.com',
    path: '/texcultv1/health',
    method: 'GET'
};

const CHECK_2_LOGIN_DB = {
    hostname: 'texcult-backend-latest-1.onrender.com',
    path: '/texcultv1/user/action/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

function runTest(name, config, payload = null) {
    return new Promise((resolve) => {
        console.log(`\n--- TEST: ${name} ---`);
        console.log(`URL: https://${config.hostname}${config.path}`);

        const req = https.request(config, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
                console.log('BODY:', data);
                resolve();
            });
        });

        req.on('error', e => {
            console.log('ERROR:', e.message);
            resolve();
        });

        if (payload) req.write(payload);
        req.end();
    });
}

async function runDiagnostics() {
    // 1. Check if Server is "On" (Health Check)
    // If this works, the App Server is running.
    await runTest('Server Health Check', CHECK_1_HEALTH);

    // 2. Check Database Connection (Login with invalid user)
    // If DB is connected, this should be 404/400 (User Not Found).
    // If DB is DOWN, this will be 500 (Internal Error).
    await runTest('Database Connectivity Check', CHECK_2_LOGIN_DB, JSON.stringify({
        username: "check.db.status@test.com",
        password: "checkpassword"
    }));
}

runDiagnostics();
