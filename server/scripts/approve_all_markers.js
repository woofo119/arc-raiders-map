import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Marker from '../models/Marker.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root (one level up from scripts)
dotenv.config({ path: path.join(__dirname, '../.env') });

const approveAllMarkers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('URI:', process.env.MONGODB_URI ? 'Found' : 'Not Found');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');

        console.log('Updating all markers to isApproved: true...');
        const result = await Marker.updateMany({}, { $set: { isApproved: true } });

        console.log(`✅ Operation Complete!`);
        console.log(`Matched: ${result.matchedCount}`);
        console.log(`Modified: ${result.modifiedCount}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

approveAllMarkers();
