import Marker from '../models/Marker.js';

// @desc    모든 마커 조회 (맵별 필터링)
// @route   GET /api/markers
// @access  Public
export const getMarkers = async (req, res) => {
    const { mapId } = req.query;

    try {
        const query = mapId ? { mapId } : {};
        // 작성자 정보(username)를 포함하여 마커 조회
        const markers = await Marker.find(query).populate('createdBy', 'username');
        res.json(markers);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// @desc    새 마커 생성
// @route   POST /api/markers
// @access  Private (로그인 필요)
export const createMarker = async (req, res) => {
    const { x, y, type, title, description, image, mapId } = req.body;

    try {
        const marker = new Marker({
            x,
            y,
            type,
            title,
            description,
            image,
            mapId,
            createdBy: req.user._id, // 인증 미들웨어에서 설정된 사용자 ID 사용
        });

        const createdMarker = await marker.save();
        res.status(201).json(createdMarker);
    } catch (error) {
        res.status(400).json({ message: '마커 생성 실패: ' + error.message });
    }
};

// @desc    마커 삭제
// @route   DELETE /api/markers/:id
// @access  Private (작성자 본인만 가능)
export const deleteMarker = async (req, res) => {
    try {
        const marker = await Marker.findById(req.params.id);

        if (marker) {
            // 요청한 사용자가 마커 작성자와 일치하는지 확인
            if (marker.createdBy.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: '삭제 권한이 없습니다.' });
            }

            await marker.deleteOne();
            res.json({ message: '마커가 삭제되었습니다.' });
        } else {
            res.status(404).json({ message: '마커를 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
