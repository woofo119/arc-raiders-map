import { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, ImageOverlay, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
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
    const borderColor = 'border-white'; // 모든 마커 흰색 테두리
    let bgColor = 'bg-gray-700'; // 기본 배경

    // 카테고리별 배경 색상 설정
    if (type === 'container') {
        bgColor = 'bg-orange-500'; // 컨테이너: 주황색 배경
    } else if (type === 'nature') {
        bgColor = 'bg-green-500'; // 자연: 초록색 배경
    } else if (type === 'location') {
        bgColor = 'bg-white'; // 위치: 흰색 배경
    }

    // 3. 아이콘 HTML 생성
    let iconHtml = '';

    // 이미지 아이콘인 경우 (경로가 /로 시작)
    if (iconDef && iconDef.icon.startsWith('/')) {
        // mix-blend-multiply를 사용하여 이미지의 흰색 배경을 투명하게 처리하고 뒤의 배경색이 보이게 함
        // noBlend 옵션이 있으면 mix-blend-multiply 제거 (투명 PNG 등)
        const blendClass = iconDef.noBlend ? '' : 'mix-blend-multiply';
        iconHtml = `<img src="${iconDef.icon}" class="w-full h-full object-contain p-1 ${blendClass}" alt="${category}" />`;
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
                {/* OFFICIAL 태그 제거 */}
                <h3 className="font-bold text-lg text-white">{marker.title}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3 break-words whitespace-pre-wrap">{marker.description}</p>

            {marker.image && (
                <div className="mb-3 rounded-lg overflow-hidden border border-gray-700">
                    <img src={marker.image} alt={marker.title} className="w-full h-auto object-cover" />
                </div>
            )}

            <div className="flex justify-between items-center text-xs text-gray-500">
                <div />

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

// 레거시 데이터(야전 -> 필드) 변환 헬퍼 함수
const getDisplayTitle = (title) => {
    if (!title) return '';
    return title.replace(/야전 저장소/g, '필드 창고')
        .replace(/야전 상자/g, '필드 상자');
};

// 지도 설정 (CRS.Simple 모드: 위도/경도 대신 픽셀 좌표 사용)
const bounds = [[0, 0], [1000, 1000]]; // 이미지 비율에 맞춰 조정 필요
const mapCenter = [500, 500];

const MapContainer = () => {
    const { markers, fetchMarkers, filters, isAuthenticated, deleteMarker, user, currentMap } = useStore();
    const [formPosition, setFormPosition] = useState(null);
    const [activeLayer, setActiveLayer] = useState(null);

    useEffect(() => {
        fetchMarkers();
    }, [fetchMarkers, currentMap]); // 맵이 변경될 때마다 마커 다시 불러오기

    useEffect(() => {
        // 맵이 변경되면 레이어 초기화 (레이어가 있으면 첫 번째 레이어, 없으면 null)
        if (currentMap.layers && currentMap.layers.length > 0) {
            setActiveLayer(currentMap.layers[0]);
        } else {
            setActiveLayer(null);
        }
    }, [currentMap]);

    // 우클릭 핸들러: 마커 생성 폼 표시
    const handleMapRightClick = (e) => {
        // 로그인 및 권한 체크 제거됨
        setFormPosition({
            x: e.latlng.lat,
            y: e.latlng.lng,
            containerPoint: e.containerPoint,
            layer: activeLayer ? activeLayer.id : null // 현재 레이어 정보 추가
        });
    };

    // 필터링된 마커 목록
    const filteredMarkers = markers.filter(m => {
        // 0. 레이어 필터 (멀티 레이어 맵인 경우)
        if (currentMap.layers && activeLayer) {
            // 마커에 레이어 정보가 없으면 기본적으로 첫 번째 레이어('top')로 간주
            const markerLayer = m.layer || currentMap.layers[0].id;
            if (markerLayer !== activeLayer.id) return false;
        }

        // 1. 카테고리(sub-type) 필터 확인
        if (filters[m.category]) return true;

        // 2. 하위 호환성: category가 없거나 'general'인 경우 type으로 확인 (기존 데이터)
        if (m.category && m.category !== 'general') {
            return filters[m.category];
        }

        // category가 없는 경우 (기존 마커): 일단 보여줌 (또는 숨김)
        return true;
    });

    // 현재 표시할 이미지 URL 결정
    const mapImageUrl = activeLayer ? activeLayer.image : currentMap.image;

    return (
        <div className="flex-1 relative h-full bg-[#0a0a0a] overflow-hidden">
            <LeafletMap
                key={currentMap.id} // 맵 ID가 바뀌면 컴포넌트를 다시 렌더링하여 이미지 갱신
                crs={L.CRS.Simple}
                bounds={bounds}
                center={mapCenter}
                zoom={0} // 초기 줌 레벨 조정
                minZoom={-2} // 더 넓게 볼 수 있도록 최소 줌 레벨 조정
                maxZoom={3.5} // 10배 이상 확대 가능하도록 조정 (2^3.32 ≈ 10)
                style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                attributionControl={false}
            >
                {/* 게임 맵 이미지 오버레이 */}
                <ImageOverlay
                    url={mapImageUrl}
                    bounds={bounds}
                />

                <MapController onRightClick={handleMapRightClick} bounds={bounds} />

                {/* 층수 전환 버튼 (레이어가 있는 경우에만 표시) */}
                {currentMap.layers && (
                    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 bg-black/80 p-2 rounded-lg border border-gray-700 backdrop-blur-sm">
                        {currentMap.layers.map(layer => (
                            <button
                                key={layer.id}
                                onClick={(e) => {
                                    e.stopPropagation(); // 맵 클릭 이벤트 전파 방지
                                    setActiveLayer(layer);
                                }}
                                className={`px-4 py-2 rounded text-sm font-bold transition-colors ${activeLayer?.id === layer.id
                                    ? 'bg-orange-500 text-black'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {layer.name}
                            </button>
                        ))}
                    </div>
                )}

                {filteredMarkers.map((marker) => {
                    const isDraggable = user && (user._id === marker.createdBy?._id || user.role === 'admin');
                    const displayTitle = getDisplayTitle(marker.title);

                    return (
                        <Marker
                            key={marker._id}
                            position={[marker.x, marker.y]}
                            icon={getIcon(marker.type, marker.category, marker.isOfficial)}
                            draggable={isDraggable}
                            eventHandlers={{
                                dragend: async (e) => {
                                    const newPos = e.target.getLatLng();
                                    const { updateMarker } = useStore.getState();
                                    await updateMarker(marker._id, undefined, undefined, newPos.lat, newPos.lng);
                                    console.log(`Marker ${marker.title} moved to:`, newPos);
                                }
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent={false}>
                                <span className="font-bold text-sm">
                                    {displayTitle ? displayTitle.split('(')[0].trim() : ''}
                                </span>
                            </Tooltip>
                            <Popup className="custom-popup-dark">
                                <MarkerPopupContent marker={{ ...marker, title: displayTitle }} />
                            </Popup>
                        </Marker>
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
