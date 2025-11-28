const axios = require('axios');

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJtaWc1dDAybDlmNWJmOGZmIiwiaWF0IjoxNzY0MzI5NzIwfQ.7h3pYZi4iVK7fQOVnR4ARKoS1lcFA4qb2BEIBZUrpO8';

async function probe(endpoint) {
    try {
        console.log(`Testing ${endpoint}...`);
        const response = await axios.get(`https://api.cloudtype.io${endpoint}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        console.log(`✅ Success: ${endpoint}`);
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log(`❌ Failed: ${endpoint} - ${error.response ? error.response.status : error.message}`);
    }
}

async function run() {
    await probe('/user');
    await probe('/users/me');
    await probe('/projects');
    await probe('/workspaces');
}

run();
