import { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, ImageOverlay, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MARKER_CATEGORIES } from '../constants';
import useStore from '../store/useStore';
import MarkerForm from './MarkerForm';

// Leaflet 기본 아이콘 경로 문제 해결
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// 마커 타입별 커스텀 아이콘 생성 함수 (기본 마커용)
// 마커 타입별 커스텀 아이콘 생성 함수
const getIcon = (type, category, isOfficial) => {
    // 1. 카테고리 정의에서 아이콘 정보 가져오기
    let iconDef = null;
    if (MARKER_CATEGORIES[type]) {
        iconDef = MARKER_CATEGORIES[type].types.find(t => t.id === category);
    }

    // 2. 테두리 및 배경 색상 결정
    let borderColor = 'border-white'; // 기본값
    let bgColor = 'bg-gray-700'; // 기본 배경

    // 카테고리별 기본 색상 설정
    // 카테고리별 기본 색상 설정
    if (type === 'container') {
        borderColor = 'border-orange-500'; // 컨테이너: 주황색 테두리
        bgColor = 'bg-orange-500'; // 컨테이너: 주황색 배경
    } else if (type === 'nature') {
        borderColor = 'border-white'; // 자연: 흰색 테두리
        bgColor = 'bg-green-500'; // 자연: 초록색 배경
    } else if (type === 'location') {
        borderColor = 'border-yellow-500'; // 위치: 노란색 테두리
        bgColor = 'bg-white'; // 위치: 흰색 배경
    }

    // 관리자(Official) 마커인 경우 테두리만 노란색으로 덮어쓰기
    if (isOfficial) {
        borderColor = 'border-yellow-500';
    }

    // 3. 아이콘 HTML 생성
    let iconHtml = '';

    // 이미지 아이콘인 경우 (경로가 /로 시작)
    if (iconDef && iconDef.icon.startsWith('/')) {
        // mix-blend-multiply를 사용하여 이미지의 흰색 배경을 투명하게 처리하고 뒤의 배경색이 보이게 함
        iconHtml = `<img src="${iconDef.icon}" class="w-full h-full object-contain p-1 mix-blend-multiply" alt="${category}" />`;
    } else {
        // 기본 색상 점 (이미지가 없는 경우)
        const colors = {
            resource: '#10B981',
            weapon: '#EF4444',
            quest: '#3B82F6',
            container: '#F59E0B',
            location: '#8B5CF6'
        };
        const color = colors[type] || '#ffffff';
        iconHtml = `<div class="w-2 h-2 rounded-full" style="background-color: ${color}"></div>`;
    }

    return L.divIcon({
        className: 'custom-icon',
        html: `
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${borderColor} ${bgColor} shadow-lg overflow-hidden">
            ${iconHtml}
        </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
};



// 마커 팝업 내용 컴포넌트 (수정 기능 포함)
const MarkerPopupContent = ({ marker }) => {
    const { user, deleteMarker, updateMarker } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(marker.title);
    const [editDescription, setEditDescription] = useState(marker.description);

    // 마커가 변경되면 에디팅 상태 초기화
    useEffect(() => {
        setEditTitle(marker.title);
        setEditDescription(marker.description);
        setIsEditing(false);
    }, [marker]);

    const handleSave = async () => {
        const result = await updateMarker(marker._id, editTitle, editDescription);
        if (result.success) {
            setIsEditing(false);
        } else {
            alert(result.message);
        }
    };

    const canEdit = user && (user._id === marker.createdBy?._id || user.role === 'admin');

    if (isEditing) {
        return (
            <div className="p-1 min-w-[200px]">
                <div className="mb-2">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm mb-2"
                        placeholder="제목"
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm h-20 resize-none"
                        placeholder="설명"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded"
                    >
                        저장
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-2">
                {marker.isOfficial && <span className="text-yellow-500 text-xs font-bold">[OFFICIAL]</span>}
                <h3 className="font-bold text-lg text-white">{marker.title}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3 break-words whitespace-pre-wrap">{marker.description}</p>

            {marker.image && (
                <div className="mb-3 rounded-lg overflow-hidden border border-gray-700">
                    <img src={marker.image} alt={marker.title} className="w-full h-auto object-cover" />
                </div>
            )}

            <div className="flex justify-between items-center text-xs text-gray-500">
                <span>By {marker.isOfficial ? 'Admin' : (marker.createdBy?.nickname || marker.createdBy?.username || 'Unknown')}</span>

                {canEdit && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-900/20 px-2 py-1 rounded transition-colors"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => deleteMarker(marker._id)}
                            className="text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-900/20 px-2 py-1 rounded transition-colors"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// 지도 이벤트 처리 및 자동 줌/이동 제어 컴포넌트
const MapController = ({ onRightClick, bounds }) => {
    const map = useMapEvents({
        contextmenu: (e) => {
            onRightClick(e);
        },
    });

    // 맵이 로드되거나 바운드가 변경되면 자동으로 맵을 중앙에 맞춤
    useEffect(() => {
        if (map && bounds) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);

    return null;
};

// 지도 설정 (CRS.Simple 모드: 위도/경도 대신 픽셀 좌표 사용)
const bounds = [[0, 0], [1000, 1000]]; // 이미지 비율에 맞춰 조정 필요
const mapCenter = [500, 500];

const MapContainer = () => {
    const { markers, fetchMarkers, filters, isAuthenticated, deleteMarker, user, currentMap } = useStore();
    const [formPosition, setFormPosition] = useState(null);

    useEffect(() => {
        fetchMarkers();
    }, [fetchMarkers, currentMap]); // 맵이 변경될 때마다 마커 다시 불러오기

    // 우클릭 핸들러: 마커 생성 폼 표시
    const handleMapRightClick = (e) => {
        if (!isAuthenticated) {
            alert('🔒 마커를 추가하려면 로그인이 필요합니다.');
            return;
        }
        setFormPosition({
            x: e.latlng.lat,
            y: e.latlng.lng,
            containerPoint: e.containerPoint
        });
    };

    // 필터링된 마커 목록
    const filteredMarkers = markers.filter(m => {
        // 1. 카테고리(sub-type) 필터 확인
        if (filters[m.category]) return true;

        // 2. 하위 호환성: category가 없거나 'general'인 경우 type으로 확인 (기존 데이터)
        // 하지만 이제 filters는 sub-type ID만 키로 가짐.
        // 따라서 기존 데이터(category='general')는 필터링에서 제외되거나, 별도 처리가 필요함.
        // 현재 스크립트로 생성된 마커는 모두 category가 있음.
        // 예전 마커를 위해 type 기반 필터링을 유지하려면, filters에 type 키도 있어야 하는데,
        // useStore 리팩토링에서 type 키는 제거됨.
        // 해결책: 마커의 category가 없으면 보여주거나(true), type에 해당하는 첫 번째 sub-type의 상태를 따르거나...
        // 여기서는 안전하게 category가 있으면 그것을 따르고, 없으면 true(보임)로 처리하거나 숨김.
        // 일단 category가 있는 것만 필터링 적용.
        if (m.category && m.category !== 'general') {
            return filters[m.category];
        }

        // category가 없는 경우 (기존 마커): 일단 보여줌 (또는 숨김)
        return true;
    });

    return (
        <div className="flex-1 relative h-full bg-[#0a0a0a] overflow-hidden">
            <LeafletMap
                key={currentMap.id} // 맵 ID가 바뀌면 컴포넌트를 다시 렌더링하여 이미지 갱신
                crs={L.CRS.Simple}
                bounds={bounds}
                center={mapCenter}
                zoom={0} // 초기 줌 레벨 조정
                minZoom={-2} // 더 넓게 볼 수 있도록 최소 줌 레벨 조정
                maxZoom={2} // 너무 확대되지 않도록 최대 줌 레벨 조정
                style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                attributionControl={false}
            >
                {/* 게임 맵 이미지 오버레이 */}
                <ImageOverlay
                    url={currentMap.image}
                    bounds={bounds}
                />

                <MapController onRightClick={handleMapRightClick} bounds={bounds} />

                {filteredMarkers.map((marker) => {
                    const isDraggable = user && (user._id === marker.createdBy?._id || user.role === 'admin');

                    return (
                    return (
                        <Marker
                            key={marker._id}
                            position={[marker.x, marker.y]}
                            icon={getIcon(marker.type, marker.category, marker.isOfficial)}
                            draggable={isDraggable}
                            eventHandlers={{
                                dragend: async (e) => {
                                    const newPos = e.target.getLatLng();
                                    // 즉시 서버에 업데이트 요청 (Manual Calibration)
                                    // updateMarker(id, title, description, x, y)
                                    // title, description은 기존 값 유지 (undefined 전달 시 유지됨 - useStore 로직 확인 필요하지만, 
                                    // useStore.js의 updateMarker는 undefined 체크를 하므로 x, y만 보내면 됨.
                                    // 단, title/desc 인자가 앞에 있으므로 undefined를 명시적으로 넘겨야 함.
                                    const { updateMarker } = useStore.getState();
                                    await updateMarker(marker._id, undefined, undefined, newPos.lat, newPos.lng);
                                    console.log(`Marker ${marker.title} moved to:`, newPos);
                                }
                            }}
                        >
                            <Popup className="custom-popup-dark">
                                <MarkerPopupContent marker={marker} />
                            </Popup>
                        </Marker>
                    );
                    );
                })}

                {/* 미리보기 마커 (클릭한 위치 표시) */}
                {formPosition && (
                    <Marker
                        position={[formPosition.x, formPosition.y]}
                        icon={L.divIcon({
                            className: 'custom-icon',
                            html: `<div class="animate-bounce text-arc-accent drop-shadow-lg filter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 22s-8-10-8-14a8 8 0 0 1 16 0c0 4-8 14-8 14z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>`,
                            iconSize: [40, 40],
                            iconAnchor: [20, 40]
                        })}
                    />
                )}
            </LeafletMap>

            {/* 마커 생성 폼 (우클릭 위치에 표시) */}
            {formPosition && (
                <MarkerForm
                    position={formPosition}
                    onClose={() => setFormPosition(null)}
                />
            )}
        </div>
    );
};
export default MapContainer;
