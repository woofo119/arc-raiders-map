import mongoose from 'mongoose';
import Marker from '../server/models/Marker.js';
import User from '../server/models/User.js';

// MongoDB Connection
mongoose.connect('mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/arc-raiders-map?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('MongoDB Connected');
        listMarkers();
    })
    .catch(err => console.error(err));

async function listMarkers() {
    try {
        // Assuming 'dam' map based on screenshot
        const markers = await Marker.find({ mapId: 'dam', type: 'location' });

        console.log('--- Extraction/Location Markers on Dam Map ---');
        markers.forEach(m => {
            console.log(`[${m._id}] ${m.title} (${m.category}) - x: ${m.x}, y: ${m.y}`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        // Close connection after a short delay to ensure logs are flushed
        setTimeout(() => mongoose.disconnect(), 1000);
    }
}
