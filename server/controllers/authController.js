import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT 토큰 생성 함수
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    회원가입
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { username, email, password, nickname } = req.body;

    try {
        // 사용자 존재 여부 확인
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
        }

        // 닉네임 중복 확인 (닉네임이 입력된 경우에만)
        if (nickname) {
            const nicknameExists = await User.findOne({ nickname });
            if (nicknameExists) {
                return res.status(400).json({ message: '이미 사용 중인 닉네임입니다.' });
            }
        }

        // 사용자 생성
        const user = await User.create({
            username,
            email,
            password,
            nickname: nickname || username // 닉네임이 없으면 아이디를 닉네임으로 사용
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                nickname: user.nickname,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: '잘못된 사용자 데이터입니다.' });
        }
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

// @desc    프로필 업데이트 (닉네임, 비밀번호)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // 닉네임 변경 요청 시 중복 확인
            if (req.body.nickname && req.body.nickname !== user.nickname) {
                const nicknameExists = await User.findOne({ nickname: req.body.nickname });
                if (nicknameExists) {
                    return res.status(400).json({ message: '이미 사용 중인 닉네임입니다.' });
                }
                user.nickname = req.body.nickname;
            }

            // 비밀번호 변경 요청 시
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                nickname: updatedUser.nickname,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
                isBanned: updatedUser.isBanned
            });
        } else {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// @desc    사용자 밴 (관리자 전용)
// @route   PUT /api/auth/ban/:username
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
