import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 사용자(User) 스키마 정의
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // 중복 방지
        trim: true,
        minlength: 3 // 최소 3글자 이상
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, '유효한 이메일 주소를 입력해주세요']
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // 최소 6글자 이상
    },
    createdAt: {
        type: Date,
        default: Date.now // 생성 시 현재 시간 자동 저장
    }
});

// 비밀번호 해싱 미들웨어 (저장 전 실행)
userSchema.pre('save', async function (next) {
    // 비밀번호가 변경되지 않았다면 해싱 건너뜀
    if (!this.isModified('password')) return next();

    try {
        // 솔트(Salt) 생성 및 비밀번호 해싱
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error('비밀번호 해싱 오류:', error);
        next(error);
    }
});

// 비밀번호 검증 메서드 (로그인 시 사용)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
