import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    reason: {
        type: String,
        default: 'No reason provided'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);
export default Blacklist;
