const https = require('https');

const config = {
    hostname: 'texcult-backend-latest-1.onrender.com',
    path: '/texcultv1/user/action/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

const payload = JSON.stringify({
    username: "definitely.does.not.exist@gmail.com",
    password: "password123"
});

const req = https.request(config, (res) => {
    let data = '';
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Response:', data));
});

req.on('error', e => console.error(e));
req.write(payload);
req.end();
