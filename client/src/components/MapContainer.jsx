import { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, ImageOverlay, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
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
const getIcon = (type) => {
    const colors = {
        resource: '#10B981', // Emerald 500
        weapon: '#EF4444',   // Red 500
        quest: '#3B82F6',    // Blue 500
        container: '#F59E0B', // Amber 500
        location: '#8B5CF6'   // Violet 500
    };

    const color = colors[type] || '#ffffff';

    return L.divIcon({
        className: 'custom-icon',
        html: `
      <div class="relative flex items-center justify-center w-4 h-4">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: ${color}"></span>
        <span class="relative inline-flex rounded-full w-3 h-3 border-2 border-white" style="background-color: ${color}"></span>
      </div>
    `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
};

// 공식 마커 아이콘 생성 함수
const getOfficialIcon = (category) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div class="w-8 h-8 bg-yellow-500/20 border-2 border-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-sm hover:scale-110 transition-transform">
            <span class="text-xs font-bold">★</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
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

const MapContainer = () => {
    const { markers, fetchMarkers, filters, isAuthenticated, deleteMarker, user, currentMap } = useStore();
    const [formPosition, setFormPosition] = useState(null);

    // 지도 설정 (CRS.Simple 모드: 위도/경도 대신 픽셀 좌표 사용)
    const bounds = [[0, 0], [1000, 1000]]; // 이미지 비율에 맞춰 조정 필요
    const mapCenter = [500, 500];

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
    const filteredMarkers = markers.filter(m => filters[m.type] || (m.isOfficial && filters.location)); // 임시 필터 로직

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

                {filteredMarkers.map((marker) => (
                    <Marker
                        key={marker._id}
                        position={[marker.x, marker.y]}
                        icon={marker.isOfficial ? getOfficialIcon(marker.category) : getIcon(marker.type)}
                    >
                        <Popup className="custom-popup-dark">
                            <div className="p-1 min-w-[200px]">
                                <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-2">
                                    {marker.isOfficial && <span className="text-yellow-500 text-xs font-bold">[OFFICIAL]</span>}
                                    <h3 className="font-bold text-lg text-white">{marker.title}</h3>
                                </div>
                                <p className="text-gray-300 text-sm mb-3 break-words">{marker.description}</p>

                                {marker.image && (
                                    <div className="mb-3 rounded-lg overflow-hidden border border-gray-700">
                                        <img src={marker.image} alt={marker.title} className="w-full h-auto object-cover" />
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>By {marker.createdBy?.nickname || marker.createdBy?.username || 'Unknown'}</span>
                                    {/* 작성자 본인 또는 관리자만 삭제 가능 */}
                                    {(user && (user._id === marker.createdBy?._id || user.role === 'admin')) && (
                                        <button
                                            onClick={() => deleteMarker(marker._id)}
                                            className="text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-900/20 px-2 py-1 rounded transition-colors"
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

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
