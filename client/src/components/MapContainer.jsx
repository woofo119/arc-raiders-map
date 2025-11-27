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

// 마커 타입별 커스텀 아이콘 생성 함수
const getIcon = (type) => {
    const colors = {
        resource: '#10B981', // Emerald 500
        weapon: '#EF4444',   // Red 500
        quest: '#3B82F6'     // Blue 500
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
    const filteredMarkers = markers.filter(m => filters[m.type]);

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
                        icon={getIcon(marker.type)}
                        onClose={() => setFormPosition(null)}
                    />
                )}
        </div>
    );
};

export default MapContainer;
