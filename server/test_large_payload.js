const API_URL = 'https://port-0-arc-server-mig6pxsra9d587bc.sel3.cloudtype.app/api';

async function testLargePayload() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'arc',
                password: '123123@'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful, token obtained.');

        // 2. Create large payload (approx 2MB)
        const largeString = 'A'.repeat(2 * 1024 * 1024); // 2MB
        const imagePayload = `data:image/png;base64,${largeString}`;

        // 3. Create marker
        console.log('Sending marker with 2MB image...');
        const markerRes = await fetch(`${API_URL}/markers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                x: 500,
                y: 500,
                type: 'location',
                title: 'Large Payload Test',
                description: 'Testing 2MB image upload',
                mapId: 'dam',
                image: imagePayload
            })
        });

        if (markerRes.ok) {
            const markerData = await markerRes.json();
            console.log('Marker created successfully:', markerData._id);
        } else {
            console.error(`Error creating marker: ${markerRes.status} ${markerRes.statusText}`);
            try {
                const errorData = await markerRes.text();
                console.error('Error details:', errorData);
            } catch (e) {
                console.error('Could not read error body');
            }
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

testLargePayload();
