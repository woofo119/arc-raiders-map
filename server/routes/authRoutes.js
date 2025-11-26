import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// 회원가입 라우트
router.post('/register', registerUser);

// 로그인 라우트
router.post('/login', loginUser);

export default router;
