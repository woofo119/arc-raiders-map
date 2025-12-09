import express from 'express';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteAllNotifications } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.delete('/', protect, deleteAllNotifications);
router.put('/:id/read', protect, markNotificationAsRead);
router.put('/read-all', protect, markAllNotificationsAsRead);

export default router;
