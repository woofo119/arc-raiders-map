const mongoose = require('mongoose');

// MongoDB Connection String (Targeting default 'test' DB as per live server config)
const MONGODB_URI = 'mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Marker Schema
const markerSchema = new mongoose.Schema({
    mapId: String,
    type: String,
    category: String,
    x: Number,
    y: Number,
    title: String,
    description: String,
    isOfficial: Boolean,
    createdBy: mongoose.Schema.Types.ObjectId,
});

const Marker = mongoose.model('Marker', markerSchema);

async function main() {
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
        console.log('Connected to MongoDB');

        // Delete all markers
        const deleteResult = await Marker.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} markers.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

main();
