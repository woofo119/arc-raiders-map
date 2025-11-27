import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log('✅ MongoDB Connected');

        const adminData = {
            username: 'arc',
            email: 'admin@arctracker.io',
            password: '123123@',
            role: 'admin'
        };

        // Check if admin exists
        const existingAdmin = await User.findOne({ username: 'arc' });
        if (existingAdmin) {
            console.log('⚠️ Admin account "arc" already exists. Updating role to admin...');
            existingAdmin.role = 'admin';
            existingAdmin.password = '123123@'; // Reset password
            await existingAdmin.save();
            console.log('✅ Admin role/password updated.');
        } else {
            await User.create(adminData);
            console.log('✅ Admin account "arc" created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
