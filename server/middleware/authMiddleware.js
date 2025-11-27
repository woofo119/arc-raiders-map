import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 인증 미들웨어: 요청 헤더의 토큰을 검증하여 사용자 식별
export const protect = async (req, res, next) => {
    let token;

    // 헤더가 'Bearer'로 시작하는지 확인
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 'Bearer ' 부분을 제외하고 토큰만 추출
            token = req.headers.authorization.split(' ')[1];

            // 토큰 검증
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            // 토큰에서 사용자 ID를 추출하여 DB에서 조회 (비밀번호 제외)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // 다음 미들웨어로 이동
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: '인증 실패: 토큰이 유효하지 않습니다.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: '인증 실패: 토큰이 없습니다.' });
    }
};

// 관리자 권한 미들웨어
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: '권한이 없습니다. 관리자만 접근 가능합니다.' });
    }
};
