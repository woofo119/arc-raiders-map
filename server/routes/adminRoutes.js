import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    getUsers,
    toggleBanUser,
    getBlacklist,
    addToBlacklist,
    removeFromBlacklist,
    getUserDetails
} from '../controllers/adminController.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

router.route('/users')
    .get(getUsers);

router.route('/users/:id/ban')
    .put(toggleBanUser);

router.route('/users/:id')
    .get(getUserDetails);

router.route('/blacklist')
    .get(getBlacklist)
    .post(addToBlacklist);

router.route('/blacklist/:id')
    .delete(removeFromBlacklist);

export default router;
