const axios = require('axios');

// Configuration
const CONFIG = {
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJtaWc1dDAybDlmNWJmOGZmIiwiaWF0IjoxNzY0MzI5NzIwfQ.7h3pYZi4iVK7fQOVnR4ARKoS1lcFA4qb2BEIBZUrpO8',
    project: 'woofo119/arc-raiders-map',
    apps: {
        frontend: 'arc-map',
        backend: 'arc-server'
    },
    stage: 'main' // Assuming 'main' stage, can be parameterized if needed
};

async function deploy(target) {
    const appName = CONFIG.apps[target];
    if (!appName) {
        console.error(`Unknown target: ${target}. Use 'frontend' or 'backend'.`);
        process.exit(1);
    }

    console.log(`🚀 Triggering deployment for ${target} (${appName})...`);

    try {
        // Using POST method as recommended
        const response = await axios.post(
            'https://api.cloudtype.io/webhooks/deploy',
            {
                project: CONFIG.project,
                app: appName,
                stage: CONFIG.stage
            },
            {
                headers: {
                    'Authorization': `Bearer ${CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ Deployment triggered successfully!`);
        console.log(`Response:`, response.data);
    } catch (error) {
        console.error(`❌ Deployment failed:`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

// CLI Argument Handling
const target = process.argv[2];
if (!target) {
    console.log('Usage: node deploy.js <frontend|backend>');
    process.exit(1);
}

deploy(target);
