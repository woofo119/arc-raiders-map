import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Marker from './models/Marker.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const MARKER_MAPPING = {
    // Nature
    'mushroom': { type: 'nature', id: 'mushroom' },
    'prickly_pear': { type: 'nature', id: 'prickly_pear' },
    'agave': { type: 'nature', id: 'agave' },
    'great_mullein': { type: 'nature', id: 'great_mullein' },
    'apricot': { type: 'nature', id: 'apricot' },
    'olives': { type: 'nature', id: 'olives' },
    'lemon': { type: 'nature', id: 'lemon' },

    // Container
    'weapon_case': { type: 'container', id: 'weapon_case' },
    'security_locker': { type: 'container', id: 'security_locker' },
    'armor_crate': { type: 'container', id: 'armor_crate' },
    'medical_box': { type: 'container', id: 'medical_box' },
    'grenade_box': { type: 'container', id: 'grenade_box' },

    // Location
    'extraction': { type: 'location', id: 'extraction' },
    'raiderhatch': { type: 'location', id: 'raider_hatch' },
    'locked': { type: 'location', id: 'locked_room' },
    'supply_station': { type: 'location', id: 'supply_call' },
    'field_depot': { type: 'location', id: 'field_depot' },
    'player_spawn': { type: 'location', id: 'player_spawn' },
    'field_crate': { type: 'location', id: 'field_crate' },
    'vent_extraction': { type: 'location', id: 'vent_extraction' },
    'train_extraction': { type: 'location', id: 'train_extraction' },
    'stairs_down': { type: 'location', id: 'stairs_down' },

    // Quest
    'quest_item': { type: 'quest', id: 'quest_item' },
    'npc': { type: 'quest', id: 'npc' }
};

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const adminUser = await User.findOne({ username: 'arc' });
        if (!adminUser) {
            console.error('❌ Admin user "arc" not found. Please create it first.');
            process.exit(1);
        }
        console.log(`✅ Found Admin User: ${adminUser.username} (${adminUser._id})`);

        // Read from parent directory
        const markersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../extracted_markers.json'), 'utf8'));
        console.log(`✅ Loaded ${markersData.length} markers from JSON`);

        const markersToInsert = [];

        for (const m of markersData) {
            const mapping = MARKER_MAPPING[m.type];
            if (!mapping) {
                console.warn(`⚠️ Unknown marker type: ${m.type} (Skipping)`);
                continue;
            }

            markersToInsert.push({
                mapId: 'dam',
                type: mapping.type,
                category: mapping.id,
                x: m.x,
                y: m.y,
                title: mapping.id.replace(/_/g, ' ').toUpperCase(),
                description: 'Imported from external data',
                isOfficial: true,
                createdBy: adminUser._id
            });
        }

        if (markersToInsert.length > 0) {
            const result = await Marker.insertMany(markersToInsert);
            console.log(`🎉 Successfully inserted ${result.length} markers!`);
        } else {
            console.log('⚠️ No markers to insert.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Error:', error);
        process.exit(1);
    }
}

migrate();
