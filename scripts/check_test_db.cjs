const mongoose = require('mongoose');

// Connection string WITHOUT database name (defaults to 'test')
const MONGODB_URI = 'mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
        console.log('Connected to MongoDB (Default DB)');

        // Check what DB we are connected to
        console.log('Current Database:', mongoose.connection.db.databaseName);

        const markerSchema = new mongoose.Schema({
            mapId: String,
            type: String,
            category: String,
            x: Number,
            y: Number,
            title: String,
            isOfficial: Boolean
        });
        const Marker = mongoose.model('Marker', markerSchema);

        const markers = await Marker.find({ category: 'apricot', mapId: 'dam' });
        console.log('Apricot Markers in Default DB:', markers.map(m => ({ x: m.x, y: m.y })));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
