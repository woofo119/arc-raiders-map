import express from 'express';
import { getPosts, getPostById, createPost, deletePost, updatePost, addComment, deleteComment } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(getPostById)
    .delete(protect, deletePost)
    .put(protect, updatePost);

router.route('/:id/comments')
    .post(protect, addComment);

router.route('/:id/comments/:commentId')
    .delete(protect, deleteComment);

export default router;
