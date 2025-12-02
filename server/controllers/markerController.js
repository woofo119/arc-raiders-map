import Marker from '../models/Marker.js';

// @desc    모든 마커 조회 (맵별 필터링, 승인된 마커만)
// @route   GET /api/markers
// @access  Public
export const getMarkers = async (req, res) => {
    const { mapId } = req.query;

    try {
        const query = { isApproved: true }; // 기본적으로 승인된 마커만 조회
        if (mapId) query.mapId = mapId;

        // 작성자 정보(username, nickname)를 포함하여 마커 조회
        const markers = await Marker.find(query).populate('createdBy', 'username nickname');
        res.json(markers);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// @desc    관리자용 마커 조회 (승인 대기 포함)
// @route   GET /api/markers/admin
// @access  Private (Admin only)
export const getAdminMarkers = async (req, res) => {
    const { mapId } = req.query;

    try {
        // 관리자인지 확인
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
        }

        const query = {};
        if (mapId) query.mapId = mapId;

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
    const { x, y, type, title, description, mapId, image, category, isOfficial, layer } = req.body;

    try {
        // 관리자는 바로 승인, 일반 유저는 대기
        const isApproved = req.user.role === 'admin';

        const marker = await Marker.create({
            x,
            y,
            mapId: mapId || 'dam',
            layer: layer || 'top', // 레이어 정보 저장
            type,
            category: category || 'general',
            title,
            description,
            image,
            isOfficial: isOfficial || false,
            isApproved, // 승인 상태 설정
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

// @desc    마커 수정 (승인 처리 포함)
// @route   PUT /api/markers/:id
// @access  Private (작성자 본인 또는 관리자만 가능)
export const updateMarker = async (req, res) => {
    const { title, description, x, y, isApproved } = req.body;

    try {
        const marker = await Marker.findById(req.params.id);

        if (marker) {
            // 작성자 본인 또는 관리자만 수정 가능
            if (marker.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: '수정 권한이 없습니다.' });
            }

            marker.title = title || marker.title;
            marker.description = description || marker.description;
            if (x !== undefined) marker.x = x;
            if (y !== undefined) marker.y = y;

            // 관리자만 승인 상태 변경 가능
            if (isApproved !== undefined && req.user.role === 'admin') {
                marker.isApproved = isApproved;
            }

            const updatedMarker = await marker.save();
            res.json(updatedMarker);
        } else {
            res.status(404).json({ message: '마커를 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
