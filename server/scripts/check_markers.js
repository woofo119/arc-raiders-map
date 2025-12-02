import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Marker from '../models/Marker.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkMarkers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');

        const markers = await Marker.find({});
        console.log(`Total Markers: ${markers.length}`);

        const counts = {};
        markers.forEach(m => {
            counts[m.category] = (counts[m.category] || 0) + 1;
        });

        console.log('Markers by Category:');
        console.table(counts);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkMarkers();
