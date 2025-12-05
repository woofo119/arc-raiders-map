import mongoose from 'mongoose';

const visitorLogSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    timestamp: { type: Date, default: Date.now, expires: '30d' } // Auto-delete after 30 days to save space
});

// Ensure unique IP per day
visitorLogSchema.index({ ip: 1, date: 1 }, { unique: true });

export default mongoose.model('VisitorLog', visitorLogSchema);
