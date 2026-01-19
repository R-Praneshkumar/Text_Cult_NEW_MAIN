const https = require('https');

// Configuration
const config = {
    hostname: 'texcult-backend-latest-1.onrender.com',
    path: '/texcultv1/user/action/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Data payload: Standard Valid Data
const payload = JSON.stringify({
    username: "pranesh.debug.node.5@gmail.com",
    password: "password123",
    firstname: "John",
    lastname: "Doe",
    companyName: "Acme Corp",
    phoneno: "+91" + Math.floor(Math.random() * 10000000000),
    buyerType: "RETAILER"
});

const req = https.request(config, (res) => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:', data);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(payload);
req.end();
