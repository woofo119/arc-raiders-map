import mongoose from 'mongoose';

// 마커(Marker) 스키마 정의
const markerSchema = new mongoose.Schema({
    x: {
        type: Number,
        required: true // 지도상의 X 좌표 (이미지 픽셀 기준)
    },
    y: {
        type: Number,
        required: true // 지도상의 Y 좌표 (이미지 픽셀 기준)
    },
    mapId: {
        type: String,
        required: true, // 맵 ID (dam, bluegate, etc.)
        index: true
    },
    layer: {
        type: String, // 층 정보 (top, bottom 등). 없으면 기본값(null 또는 top)으로 처리
        default: 'top'
    },
    type: {
        type: String,
        enum: ['resource', 'weapon', 'quest', 'container', 'location', 'nature'], // 허용된 마커 타입
        required: true
    },
    category: {
        type: String, // detailed type: weapon_case, extraction, etc.
        default: 'general'
    },
    isOfficial: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true,
        trim: true // 제목 (아이템명 등)
    },
    description: {
        type: String,
        trim: true // 상세 설명
    },
    image: {
        type: String,
        trim: true // 이미지 URL
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User 모델 참조
        required: true // 작성자 정보 필수
    },
    createdAt: {
        type: Date,
        default: Date.now // 생성 시간
    }
});

const Marker = mongoose.model('Marker', markerSchema);
export default Marker;
