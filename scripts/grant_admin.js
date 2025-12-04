import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function grantAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Define User schema
        const userSchema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, default: 'user' },
            nickname: String,
            createdAt: { type: Date, default: Date.now }
        });

        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const targetUsername = 'BIG';
        const targetPassword = '123123@';
        const targetEmail = 'big@admin.com'; // Dummy email

        let user = await User.findOne({ username: targetUsername });

        if (!user) {
            console.log(`User '${targetUsername}' not found. Creating new admin user...`);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(targetPassword, salt);

            user = new User({
                username: targetUsername,
                email: targetEmail,
                password: hashedPassword,
                role: 'admin',
                nickname: 'BIG'
            });

            await user.save();
            console.log(`Successfully created admin user '${targetUsername}'.`);
        } else {
            console.log(`Found user: ${user.username}, Current Role: ${user.role}`);
            if (user.role === 'admin') {
                console.log('User is already an admin.');
            } else {
                user.role = 'admin';
                await User.updateOne({ _id: user._id }, { $set: { role: 'admin' } });
                console.log(`Successfully updated role to 'admin' for user '${targetUsername}'.`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

grantAdmin();
