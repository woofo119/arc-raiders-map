import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const migrateNicknames = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log('✅ MongoDB Connected');

        const users = await User.find({ nickname: { $exists: false } });
        console.log(`🔍 Found ${users.length} users without nickname.`);

        for (const user of users) {
            user.nickname = user.username; // 기본값으로 username 설정
            await user.save();
            console.log(`✅ Updated: ${user.username} -> nickname: ${user.nickname}`);
        }

        console.log('🎉 Migration Completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Error:', error);
        process.exit(1);
    }
};

migrateNicknames();
