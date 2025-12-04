import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');

        const user = await User.findOne({ email: 'devlok@outlook.com' });

        if (user) {
            console.log('User Found:');
            console.log('Username:', user.username);
            console.log('Nickname:', user.nickname);
            console.log('Email:', user.email);
            console.log('Role:', user.role);
            console.log('Created At:', user.createdAt);
            console.log('Updated At:', user.updatedAt);
        } else {
            console.log('User not found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('DB Disconnected');
    }
};

checkUser();
