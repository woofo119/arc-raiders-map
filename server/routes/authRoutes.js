import express from 'express';
import { registerUser, loginUser, toggleBan, updateProfile, getMe } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 회원가입 라우트
router.post('/register', registerUser);

// 로그인 라우트
router.post('/login', loginUser);

// 사용자 밴 라우트 (관리자 전용)
router.put('/ban/:username', protect, admin, toggleBan);

// 프로필 업데이트 라우트 (로그인 필요)
router.put('/profile', protect, updateProfile);

// 내 정보 조회
router.get('/me', protect, getMe);

export default router;
