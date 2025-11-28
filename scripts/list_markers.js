const mongoose = require('mongoose');
const Marker = require('../server/models/Marker');
const User = require('../server/models/User'); // Required for population

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/arc-raiders-map', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

async function listMarkers() {
    try {
        // Assuming 'dam' map based on screenshot
        const markers = await Marker.find({ mapId: 'dam', type: 'location' }); // Filter for location/extraction

        console.log('--- Extraction/Location Markers on Dam Map ---');
        markers.forEach(m => {
            console.log(`[${m._id}] ${m.title} (${m.category}) - x: ${m.x}, y: ${m.y}`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
}

listMarkers();
