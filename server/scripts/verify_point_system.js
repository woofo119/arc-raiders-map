import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:5000/api';

// Helper to login and get token
const login = async (email, password) => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        return { token: res.data.token, user: res.data };
    } catch (e) {
        // If login fails, maybe register?
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                username: email.split('@')[0],
                nickname: email.split('@')[0],
                email,
                password
            });
            return { token: res.data.token, user: res.data };
        } catch (regErr) {
            console.error('Login/Register Failed', regErr.response?.data || regErr.message);
            throw regErr;
        }
    }
};

const getPoints = async (token) => {
    const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.points;
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for cleanup');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

import User from '../models/User.js';

const runTest = async () => {
    console.log('Starting Point System Verification...');
    await connectDB();

    try {
        await User.deleteMany({ email: { $in: ['point_user_a@test.com', 'point_user_b@test.com'] } });
        console.log('Cleaned up old test users.');
    } catch (e) {
        console.error('Cleanup failed:', e);
    }

    try {
        // 1. Setup Data (Register/Login 2 Users)
        // Login will fail now, so it will register.
        const userA = await login('point_user_a@test.com', 'password123!');
        const userB = await login('point_user_b@test.com', 'password123!');

        const initialPointsA = await getPoints(userA.token);
        const initialPointsB = await getPoints(userB.token);
        console.log(`Initial Points: A=${initialPointsA}, B=${initialPointsB}`);

        // 2. User A Creates Post (+10)
        const postRes = await axios.post(`${API_URL}/posts`, {
            title: 'Point Test Post',
            content: 'Testing Points',
            category: 'free'
        }, { headers: { Authorization: `Bearer ${userA.token}` } });

        const postId = postRes.data._id;
        const pointsA_afterPost = await getPoints(userA.token);
        console.log(`[A Post] Expected: ${initialPointsA + 10}, Actual: ${pointsA_afterPost} -> ${initialPointsA + 10 === pointsA_afterPost ? 'PASS' : 'FAIL'}`);

        // 3. User B Comments (+5)
        const commentRes = await axios.post(`${API_URL}/posts/${postId}/comments`, {
            content: 'Nice points!'
        }, { headers: { Authorization: `Bearer ${userB.token}` } });

        const commentId = commentRes.data[0]._id; // Assuming returns array of comments or the last one? Controller returns post.comments array.
        // Wait, controller returns `res.status(201).json(post.comments);`
        // We need the ID of the new comment. It's the last one.
        const newCommentId = commentRes.data[commentRes.data.length - 1]._id;

        const pointsB_afterComment = await getPoints(userB.token);
        console.log(`[B Comment] Expected: ${initialPointsB + 5}, Actual: ${pointsB_afterComment} -> ${initialPointsB + 5 === pointsB_afterComment ? 'PASS' : 'FAIL'}`);

        // 4. User B Likes Post (A gets +5)
        await axios.put(`${API_URL}/posts/${postId}/like`, {
            action: 'like', target: 'post'
        }, { headers: { Authorization: `Bearer ${userB.token}` } });

        const pointsA_afterLike = await getPoints(userA.token);
        console.log(`[B Likes A's Post] A Expected: ${pointsA_afterPost + 5}, Actual: ${pointsA_afterLike} -> ${pointsA_afterPost + 5 === pointsA_afterLike ? 'PASS' : 'FAIL'}`);

        // 5. User B Dislikes Post (A gets -5 removal -5 penalty = -10 from peak? Or specific logic?)
        // Logic: Like (+5) -> Dislike (Remove Like -5, Add Dislike -5) = Net -10 change.
        // Current A points: Post(+10) + Like(+5) = 15 (if initial 0).
        // After toggle Dislike: Post(+10) - Dislike(-5) = 5.
        await axios.put(`${API_URL}/posts/${postId}/like`, {
            action: 'dislike', target: 'post'
        }, { headers: { Authorization: `Bearer ${userB.token}` } });

        const pointsA_afterDislike = await getPoints(userA.token);
        console.log(`[B Dislikes A's Post] A Expected (Undo Like -5, Add Dislike -5): ${pointsA_afterLike - 10}, Actual: ${pointsA_afterDislike} -> ${pointsA_afterLike - 10 === pointsA_afterDislike ? 'PASS' : 'FAIL'}`);

        // 6. User A Likes Comment (B gets +2)
        await axios.put(`${API_URL}/posts/${postId}/like`, {
            action: 'like', target: 'comment', commentId: newCommentId
        }, { headers: { Authorization: `Bearer ${userA.token}` } });

        const pointsB_afterCommentLike = await getPoints(userB.token);
        console.log(`[A Likes B's Comment] B Expected: ${pointsB_afterComment + 2}, Actual: ${pointsB_afterCommentLike} -> ${pointsB_afterComment + 2 === pointsB_afterCommentLike ? 'PASS' : 'FAIL'}`);

        // 7. User A Dislikes Comment (B gets -2 removal -2 penalty = -4)
        await axios.put(`${API_URL}/posts/${postId}/like`, {
            action: 'dislike', target: 'comment', commentId: newCommentId
        }, { headers: { Authorization: `Bearer ${userA.token}` } });

        const pointsB_afterCommentDislike = await getPoints(userB.token);
        console.log(`[A Dislikes B's Comment] B Expected: ${pointsB_afterCommentLike - 4}, Actual: ${pointsB_afterCommentDislike} -> ${pointsB_afterCommentLike - 4 === pointsB_afterCommentDislike ? 'PASS' : 'FAIL'}`);

        console.log('Verification Complete.');

    } catch (error) {
        console.error('Verification Error:', error.response?.data || error.message);
    }
};

runTest();
