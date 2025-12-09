import axios from 'axios';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js'; // Ensure Post model is imported
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:5000/api';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

const login = async (email, password) => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        return { token: res.data.token, user: res.data };
    } catch (e) {
        // Register if login fails
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

const runTest = async () => {
    console.log('Starting Reply System Verification...');
    await connectDB();

    // Cleanup
    await User.deleteMany({ email: { $in: ['reply_user_a@test.com', 'reply_user_b@test.com'] } });
    await Post.deleteMany({ title: 'Reply Test Post' });

    try {
        const userA = await login('reply_user_a@test.com', 'password123!');
        const userB = await login('reply_user_b@test.com', 'password123!');

        // 1. User A Creates Post
        const postRes = await axios.post(`${API_URL}/posts`, {
            title: 'Reply Test Post',
            content: 'Testing Replies',
            category: 'free'
        }, { headers: { Authorization: `Bearer ${userA.token}` } });

        const postId = postRes.data._id;
        console.log('Post Created:', postId);

        // 2. User B Comments (Root)
        const commentRes = await axios.post(`${API_URL}/posts/${postId}/comments`, {
            content: 'Root Comment'
        }, { headers: { Authorization: `Bearer ${userB.token}` } });

        // commentRes.data is the Updated Post object with comments array
        const rootCommentId = commentRes.data.comments[commentRes.data.comments.length - 1]._id;
        console.log('Root Comment Created:', rootCommentId);

        // 3. User A Replies to User B's Comment
        const replyRes = await axios.post(`${API_URL}/posts/${postId}/comments`, {
            content: 'This is a reply',
            parentId: rootCommentId
        }, { headers: { Authorization: `Bearer ${userA.token}` } });

        const replyComment = replyRes.data.comments[replyRes.data.comments.length - 1];
        console.log('Reply Created:', replyComment._id);
        console.log('Reply ParentId:', replyComment.parentId);

        if (replyComment.parentId === rootCommentId) {
            console.log('PASS: Reply correctly linked to parent.');
        } else {
            console.log(`FAIL: Expected parentId ${rootCommentId}, got ${replyComment.parentId}`);
        }

    } catch (error) {
        console.error('Verification Error:', error.response?.data || error.message);
    }

    process.exit(0);
};

runTest();
