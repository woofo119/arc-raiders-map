import mongoose from 'mongoose';

const weaponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Main', 'Side', 'Melee', 'Grenade', 'Gadget'],
        default: 'Main'
    },
    imageUrl: {
        type: String, // Base64 or URL
        required: false
    },
    description: {
        type: String,
        required: false
    },
    stats: {
        type: Map,
        of: String, // Flexible value type (can be number stored as string or just text)
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Weapon = mongoose.model('Weapon', weaponSchema);

export default Weapon;
