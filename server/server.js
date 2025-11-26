import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import markerRoutes from './routes/markerRoutes.js';

// .env 파일 설정 로드
dotenv.config();

app.use(express.json()); // JSON 요청 본문 파싱

// Socket.io 이벤트 처리
io.on('connection', (socket) => {
    console.log('새로운 사용자가 채팅에 접속했습니다:', socket.id);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // 모든 클라이언트에게 메시지 전송
    });

    socket.on('disconnect', () => {
        console.log('사용자가 채팅 연결을 끊었습니다:', socket.id);
    });
});

// 서버 시작 (app.listen 대신 httpServer.listen 사용)
httpServer.listen(PORT, () => {
    console.log(`🚀 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
