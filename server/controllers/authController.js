import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT 토큰 생성 함수
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d', // 토큰 유효 기간 30일
    });
};

// @desc    회원가입 (새 사용자 등록)
// @route   POST /api/auth/register
// @access  Public (누구나 접근 가능)
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 이미 존재하는 사용자인지 확인 (이메일 또는 사용자명)
        const userExists = await User.findOne({ $or: [{ username }, { email }] });

        if (userExists) {
            return res.status(400).json({ message: '이미 존재하는 사용자명 또는 이메일입니다.' });
        }

        // 새 사용자 생성
        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            // 성공 시 사용자 정보와 토큰 반환
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: '잘못된 사용자 데이터입니다.' });
        }
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// @desc    로그인 (토큰 발급)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 사용자 조회
        const user = await User.findOne({ username });

        // 사용자 존재 여부 및 비밀번호 일치 확인
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
