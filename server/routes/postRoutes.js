import express from 'express';
import { getPosts, getPostById, createPost, deletePost, updatePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(getPostById)
    .delete(protect, deletePost)
    .put(protect, updatePost);

export default router;
