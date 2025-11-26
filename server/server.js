import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import markerRoutes from './routes/markerRoutes.js';

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