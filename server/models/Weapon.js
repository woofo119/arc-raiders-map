import mongoose from 'mongoose';

const weaponSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['Main', 'Side', 'Melee', 'Grenade', 'Gadget'], default: 'Main' },
    grade: { type: String, enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'], default: 'Common' },
    imageUrl: { type: String },

    // Detailed Stats (Wiki Style)
    description: { type: String, default: '' },
    ammoType: { type: String, default: '' },
    magazineSize: { type: String, default: '' },
    fireMode: { type: String, default: '' },
    penetration: { type: String, default: '' },

    stats: {
        damage: { type: Number, default: 0 },
        fireRate: { type: Number, default: 0 },
        range: { type: Number, default: 0 },
        stability: { type: Number, default: 0 },
        mobility: { type: Number, default: 0 },
        stealth: { type: Number, default: 0 }
    },

    weight: { type: Number, default: 0 },

    // Crafting / Upgrades (Levels I-IV)
    crafting: [{
        level: { type: Number },
        bonusStats: { type: String },
        materials: [{ name: String, count: Number }],
        cost: { type: Number }
    }],

    createdAt: { type: Date, default: Date.now }
});

const Weapon = mongoose.model('Weapon', weaponSchema);

export default Weapon;
