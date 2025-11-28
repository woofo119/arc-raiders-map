const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// MongoDB Connection String
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

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    nickname: String,
});
const User = mongoose.model('User', userSchema);

// Icon Mapping
const ICON_MAPPING = {
    'prickly_pear': { type: 'nature', category: 'prickly_pear', title: 'Prickly Pear' },
    'agave': { type: 'nature', category: 'agave', title: 'Agave' },
    'great_mullein': { type: 'nature', category: 'great_mullein', title: 'Great Mullein' },
    'apricot': { type: 'nature', category: 'apricot', title: 'Apricot' },
    'olives': { type: 'nature', category: 'olives', title: 'Olives' },
    'lemon': { type: 'nature', category: 'lemon', title: 'Lemon' },
    'mushroom': { type: 'nature', category: 'mushroom', title: 'Mushroom' },

    'weapon_case': { type: 'container', category: 'weapon_case', title: 'Weapon Case' },
    'security_locker': { type: 'container', category: 'security_locker', title: 'Security Locker' },
    'armor_crate': { type: 'container', category: 'armor_crate', title: 'Armor Crate' },
    'medical_box': { type: 'container', category: 'medical_box', title: 'Medical Box' },
    'grenade_box': { type: 'container', category: 'grenade_box', title: 'Grenade Box' },

    'extraction': { type: 'location', category: 'extraction', title: 'Extraction' },
    'supply_station': { type: 'location', category: 'supply_call', title: 'Supply Call Station' },
    'field_depot': { type: 'location', category: 'field_depot', title: 'Field Depot' },
    'player_spawn': { type: 'location', category: 'player_spawn', title: 'Player Spawn' },
    'locked': { type: 'location', category: 'locked_room', title: 'Locked Room' },
    'raider_hatch': { type: 'location', category: 'raider_hatch', title: 'Raider Hatch' },
    'field_crate': { type: 'location', category: 'field_crate', title: 'Field Crate' },
    'vent_extraction': { type: 'location', category: 'vent_extraction', title: 'Vent Extraction' },
    'train_extraction': { type: 'location', category: 'train_extraction', title: 'Train Extraction' },
    'stairs_down': { type: 'location', category: 'stairs_down', title: 'Stairs Down' },
};

async function main() {
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
        console.log('Connected to MongoDB');

        // Find Admin User
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('Admin user not found. Creating one...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            adminUser = await User.create({
                username: 'admin',
                email: 'admin@arctracker.io',
                password: hashedPassword,
                role: 'admin',
                nickname: 'Admin'
            });
        }

        // Read markers.txt
        const markersPath = path.join(__dirname, '../markers.txt');
        const content = fs.readFileSync(markersPath, 'utf8');

        // Regex to find markers
        const markerRegex = /transform:\s*translate3d\(\s*([\d.]+)px,\s*([\d.]+)px,\s*0px\)[^>]*>[\s\S]*?<img[^>]+src="[^"]*\/([^/"]+)\.png"/g;

        const newMarkers = [];
        let match;

        while ((match = markerRegex.exec(content)) !== null) {
            const rawX = parseFloat(match[1]);
            const rawY = parseFloat(match[2]);
            const iconName = match[3];

            const mapping = ICON_MAPPING[iconName];
            if (mapping) {
                // RESET Logic: Standard HTML to Leaflet conversion
                // HTML (0,0) is Top-Left
                // Leaflet (0,0) is Bottom-Left (usually)
                // So x = rawX, y = 1000 - rawY

                let targetX = rawX;
                let targetY = 1000 - rawY;

                newMarkers.push({
                    mapId: 'dam',
                    type: mapping.type,
                    category: mapping.category,
                    x: targetX,
                    y: targetY,
                    title: mapping.title,
                    description: 'Reset from original map data',
                    isOfficial: true,
                    createdBy: adminUser._id,
                });
            }
        }

        console.log(`Parsed ${newMarkers.length} markers.`);

        if (newMarkers.length > 0) {
            // Delete existing official markers for this map
            const deleteResult = await Marker.deleteMany({ mapId: 'dam', isOfficial: true });
            console.log(`Deleted ${deleteResult.deletedCount} existing official markers.`);

            // Insert new markers
            const insertResult = await Marker.insertMany(newMarkers);
            console.log(`Inserted ${insertResult.length} new markers.`);
        } else {
            console.log('No markers found to insert.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

main();
