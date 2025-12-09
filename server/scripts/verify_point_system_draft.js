import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

const verifyPointSystem = async () => {
    await connectDB();

    try {
        // Cleaning up test data
        await User.deleteMany({ email: { $in: ['point_a@test.com', 'point_b@test.com'] } });
        await Post.deleteMany({ title: 'Point System Test Post' });

        // 1. Create Users
        const userA = await User.create({
            username: 'PointUserA',
            nickname: 'PointA',
            email: 'point_a@test.com',
            password: 'password123',
            points: 0
        });

        const userB = await User.create({
            username: 'PointUserB',
            nickname: 'PointB',
            email: 'point_b@test.com',
            password: 'password123',
            points: 0
        });

        console.log('Users created. Points: A=0, B=0');

        // 2. User A creates Post (+10)
        // Simulate Controller Logic directly or call API?
        // Since we want to test Controller Logic, calling API is better, 
        // but here we are in a script. We can simulate the logic manually 
        // OR import controller functions (mock req/res) 
        // OR just test the MODEL/DB outcomes if we assume Controller is correct.
        // BETTER: Use axios to call running server? Or mock.
        // Let's rely on the fact that I changed the controller. 
        // Testing via script that imports controller is hard due to req/res mocking.
        // I'll test via `fetch` calls to the running server.

        console.log('Use this script to manual verification or write an API client test.');

    } catch (error) {
        console.error(error);
    }
};

// Actually, I'll write a script that USES REQUESTS to localhost:5000
// Assuming server is running on 5000.
