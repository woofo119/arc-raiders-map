import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT 토큰 생성 함수
// @access  Private (Admin)
export const toggleBan = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // 관리자는 밴 불가
        if (user.role === 'admin') {
            try {
                // 사용자 조회
                const user = await User.findOne({ username });
                import User from '../models/User.js';
                import jwt from 'jsonwebtoken';
                import bcrypt from 'bcryptjs';

                // JWT 토큰 생성 함수
                // @access  Private (Admin)
                export const toggleBan = async (req, res) => {
                    try {
                        const user = await User.findOne({ username: req.params.username });

                        if (!user) {
                            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
                        }

                        // 관리자는 밴 불가
                        if (user.role === 'admin') {
                            return res.status(400).json({ message: '관리자는 밴할 수 없습니다.' });
                        }

                        user.isBanned = !user.isBanned;
                        await user.save();

                        res.json({
                            message: `사용자 ${user.username}의 밴 상태가 ${user.isBanned ? '설정' : '해제'}되었습니다.`,
                            isBanned: user.isBanned
                        });
                    } catch (error) {
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
                                nickname: user.nickname || user.username, // 닉네임 없으면 아이디 반환
                                email: user.email,
                                role: user.role,
                                token: generateToken(user._id),
                                isBanned: user.isBanned
                            });
                        } else {
                            res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
                        }
                    } catch (error) {
                        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
                    }
                };
