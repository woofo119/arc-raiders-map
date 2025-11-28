import Marker from '../models/Marker.js';

// @desc    모든 마커 조회 (맵별 필터링)
// @route   GET /api/markers
// @access  Public
export const getMarkers = async (req, res) => {
    const { mapId } = req.query;

    try {
        const query = mapId ? { mapId } : {};
        // 작성자 정보(username, nickname)를 포함하여 마커 조회
        const markers = await Marker.find(query).populate('createdBy', 'username nickname');
        res.json(markers);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// @desc    새 마커 생성
// @route   POST /api/markers
// @access  Private (로그인 필요)
export const createMarker = async (req, res) => {
    const { x, y, type, title, description, mapId, image, category, isOfficial } = req.body;

    try {
        const marker = await Marker.create({
            x,
            y,
            mapId: mapId || 'dam',
            type,
            category: category || 'general',
            title,
            description,
            image,
            isOfficial: isOfficial || false,
            createdBy: req.user._id,
        });
        res.status(201).json(marker);
    } catch (error) {
        res.status(500).json({ message: '마커 생성 실패', error: error.message });
    }
};

// @desc    마커 삭제
// @route   DELETE /api/markers/:id
// @access  Private (작성자 본인 또는 관리자만 가능)
export const deleteMarker = async (req, res) => {
    try {
        const marker = await Marker.findById(req.params.id);

        if (marker) {
            // 작성자 본인 또는 관리자만 삭제 가능
            if (marker.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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

// @desc    마커 수정
// @route   PUT /api/markers/:id
// @access  Private (작성자 본인 또는 관리자만 가능)
export const updateMarker = async (req, res) => {
    const { title, description, image } = req.body;

    try {
        const marker = await Marker.findById(req.params.id);

        if (marker) {
            // 작성자 본인 또는 관리자만 수정 가능
            if (marker.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: '수정 권한이 없습니다.' });
            }

            marker.title = title || marker.title;
            marker.description = description || marker.description;
            if (image !== undefined) marker.image = image; // 이미지가 빈 문자열일 수도 있으므로 undefined 체크

            const updatedMarker = await marker.save();
            res.json(updatedMarker);
        } else {
            res.status(404).json({ message: '마커를 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
