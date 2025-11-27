import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import markerRoutes from './routes/markerRoutes.js';
import User from './models/User.js';

// .env 파일 설정 로드
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// CORS 설정 (모든 도메인 허용)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' })); // 이미지 업로드를 위해 용량 제한 늘림
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://woofo:da868133@cluster0.iienqyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// 라우트 연결
app.use('/api/auth', authRoutes);
app.use('/api/markers', markerRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.send('ARC Raiders Map API Server Running');
});

// Socket.IO 설정
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.io 이벤트 처리
io.on('connection', (socket) => {
    console.log('새로운 사용자가 채팅에 접속했습니다:', socket.id);

    socket.on('chat message', async (msg) => {
        try {
            // 메시지 보낸 유저가 밴 상태인지 확인
            // msg.sender는 username이라고 가정
            if (msg.sender && msg.sender !== '익명') {
                const user = await User.findOne({ username: msg.sender });
                if (user && user.isBanned) {
                    // 밴 된 유저에게만 에러 메시지 전송 (선택 사항)
                    socket.emit('error', '관리자에 의해 채팅이 금지되었습니다.');
                    return; // 브로드캐스트 하지 않음
                }
            }
            io.emit('chat message', msg);
        } catch (error) {
            console.error('Socket Error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('사용자가 채팅 연결을 끊었습니다:', socket.id);
    });
});

// 서버 시작
httpServer.listen(PORT, () => {
    console.log(`🚀 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});