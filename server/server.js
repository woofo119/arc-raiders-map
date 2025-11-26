import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import markerRoutes from './routes/markerRoutes.js';

// .env 파일 설정 로드
dotenv.config();

// 앱 및 서버 초기화
const app = express();
const httpServer = createServer(app);

// ▼▼▼ [중요] 프론트엔드 주소 (여기에 본인의 arc-map 주소를 넣으세요) ▼▼▼
// 예시: 'https://arc-map-woofo.cloudtype.app'
// 주소 뒤에 슬래시(/)는 빼야 합니다!
const CLIENT_URL = 'https://arc-map-woofo.cloudtype.app';

// 1. Socket.IO 설정 (채팅용)
const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_URL, // 클라이언트 주소만 허용
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;

// 2. Express CORS 설정 (로그인/API용)
app.use(cors({
    origin: CLIENT_URL, // 클라이언트 주소만 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // 쿠키/인증 정보 허용
}));

app.use(express.json());

// DB 연결
mongoose.connect("mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// 라우트 연결
app.use('/api/auth', authRoutes);
app.use('/api/markers', markerRoutes);

// Socket.io 이벤트 처리
io.on('connection', (socket) => {
    console.log('새로운 사용자가 채팅에 접속했습니다:', socket.id);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('사용자가 채팅 연결을 끊었습니다:', socket.id);
    });
});

// 서버 시작
httpServer.listen(PORT, () => {
    console.log(`🚀 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});