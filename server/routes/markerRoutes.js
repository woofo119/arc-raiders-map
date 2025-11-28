import express from 'express';
import { getMarkers, createMarker, deleteMarker, updateMarker } from '../controllers/markerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 루트 경로 ('/')
router.route('/')
    .get(getMarkers) // 모든 마커 조회 (공개)
    .post(protect, createMarker); // 마커 생성 (로그인 필요)

// ID 경로 ('/:id')
router.route('/:id')
    .delete(protect, deleteMarker) // 마커 삭제 (작성자 본인만)
    .put(protect, updateMarker); // 마커 수정 (작성자 본인만)

export default router;
