import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from parent directory (server root)
dotenv.config({ path: path.join(__dirname, '../.env') });

const updateArcUser = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Try getting user by username 'arc'
        let user = await User.findOne({ username: 'arc' });

        if (!user) {
            console.log("⚠️ User with username 'arc' not found. Trying nickname...");
            user = await User.findOne({ nickname: 'arc' });
        }

        if (user) {
            console.log(`👤 Found user: ${user.username} (${user.nickname})`);
            console.log(`   Current: Level ${user.level}, Points ${user.points}`);

            user.level = 11;
            user.points = 1800;

            await user.save();
            console.log(`✅ Updated: Level ${user.level}, Points ${user.points}`);
        } else {
            console.error('❌ User "arc" not found by username or nickname.');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateArcUser();
