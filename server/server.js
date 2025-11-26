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
const io = new Server(httpServer, {
    cors: {
        origin: "*", // 모든 도메인에서 접속 허용
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// ▼▼▼▼▼ [DB 연결: 사용자님의 진짜 주소 적용 완료] ▼▼▼▼▼
mongoose.connect("mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ DB Connection Error:", err));
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

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