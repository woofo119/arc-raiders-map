import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import authRoutes from './routes/authRoutes.js';
import markerRoutes from './routes/markerRoutes.js';
import postRoutes from './routes/postRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import weaponRoutes from './routes/weaponRoutes.js';
import User from './models/User.js';
import { checkBlacklist } from './middleware/ipMiddleware.js';

// .env 파일 설정 로드
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// 🔍 디버깅: JWT_SECRET 확인
if (!process.env.JWT_SECRET) {
    console.error("🔥🔥🔥 CRITICAL ERROR: JWT_SECRET 환경 변수가 설정되지 않았습니다! 로그인이 불가능합니다. 🔥🔥🔥");
} else {
    console.log("✅ JWT_SECRET이 설정되었습니다:", process.env.JWT_SECRET.substring(0, 3) + "***");
}

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// CORS 설정 (모든 도메인 허용)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' })); // 이미지 업로드를 위해 용량 제한 늘림
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// IP 차단 미들웨어 (모든 요청에 적용)
app.use(checkBlacklist);

// 🔍 디버깅: 모든 요청 로깅
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/markers', markerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/weapons', weaponRoutes);

// 서버 시작
httpServer.listen(PORT, () => {
    console.log(`🚀 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});