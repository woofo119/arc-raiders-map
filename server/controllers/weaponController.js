import Weapon from '../models/Weapon.js';

// @desc    Get all weapons
// @route   GET /api/weapons
// @access  Public
export const getWeapons = async (req, res) => {
    try {
        const weapons = await Weapon.find().sort({ createdAt: -1 });
        res.json(weapons);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new weapon
// @route   POST /api/weapons
// @access  Private/Admin
export const createWeapon = async (req, res) => {
    try {
        const { name, type, imageUrl, description, stats } = req.body;

        const weapon = new Weapon({
            name,
            type,
            imageUrl,
            description,
            stats
        });

        const createdWeapon = await weapon.save();
        res.status(201).json(createdWeapon);
    } catch (error) {
        res.status(400).json({ message: 'Invalid weapon data', error: error.message });
    }
};

// @desc    Delete a weapon
// @route   DELETE /api/weapons/:id
// @access  Private/Admin
export const deleteWeapon = async (req, res) => {
    try {
        const weapon = await Weapon.findById(req.params.id);

        if (weapon) {
            await weapon.deleteOne();
            res.json({ message: 'Weapon removed' });
        } else {
            res.status(404).json({ message: 'Weapon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
