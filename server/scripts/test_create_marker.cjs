const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arc-raiders';

const markerSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    mapId: { type: String, required: true },
    type: { type: String, enum: ['resource', 'weapon', 'quest', 'container', 'location', 'nature'], required: true },
    category: { type: String, default: 'general' },
    isOfficial: { type: Boolean, default: false },
    title: { type: String, required: true },
    description: String,
    image: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Marker = mongoose.model('Marker', markerSchema);

const userSchema = new mongoose.Schema({
    username: String,
    role: String,
});
const User = mongoose.model('User', userSchema);

async function main() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('Admin user not found');
            process.exit(1);
        }

        console.log(`Attempting to create marker as ${adminUser.username}...`);

        const markerData = {
            x: 500,
            y: 500,
            mapId: 'dam',
            type: 'location', // Valid enum
            category: 'extraction',
            title: 'Test Admin Marker',
            description: 'Created via script',
            isOfficial: true,
            createdBy: adminUser._id
        };

        const marker = await Marker.create(markerData);
        console.log('Marker created successfully:', marker);

    } catch (error) {
        console.error('Marker creation failed:', error.message);
        if (error.errors) {
            console.error('Validation errors:', error.errors);
        }
    } finally {
        await mongoose.disconnect();
    }
}

main();
