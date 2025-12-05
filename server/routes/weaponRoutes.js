import express from 'express';
import { getWeapons, createWeapon, deleteWeapon } from '../controllers/weaponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getWeapons) // Public
    .post(protect, admin, createWeapon); // Admin only

router.route('/:id')
    .delete(protect, admin, deleteWeapon); // Admin only

export default router;
