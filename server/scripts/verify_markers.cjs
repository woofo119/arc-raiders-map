const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arc-raiders';

const markerSchema = new mongoose.Schema({
    mapId: String,
    type: String,
    category: String,
    x: Number,
    y: Number,
    title: String,
});

const Marker = mongoose.model('Marker', markerSchema);

async function main() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check for a specific marker
        // Expected: Prickly Pear at x=336, y=382 (approx)
        // Original: 382, 664
        const marker = await Marker.findOne({ category: 'prickly_pear', y: 382 });

        if (marker) {
            console.log('Found Marker:', marker);
            console.log(`Coordinates: x=${marker.x}, y=${marker.y}`);
            if (Math.abs(marker.x - 336) < 1) {
                console.log('VERIFICATION PASSED: Coordinates match expected transformation.');
            } else {
                console.error('VERIFICATION FAILED: Coordinates do not match.');
            }
        } else {
            console.log('Marker not found with exact y=382. Listing first 5 markers:');
            const markers = await Marker.find({}).limit(5);
            console.log(markers);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
