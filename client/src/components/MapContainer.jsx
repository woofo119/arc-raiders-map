import { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, ImageOverlay, Marker, Popup, Tooltip, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { MARKER_CATEGORIES } from '../constants';
import useStore from '../store/useStore';
import MarkerForm from './MarkerForm';

// ... (중략) ...

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
            zoomControl={false} // 기본 줌 컨트롤 비활성화
        >
            {/* 줌 컨트롤 우측 상단 배치 */}
            <ZoomControl position="topright" />

            {/* 게임 맵 이미지 오버레이 */}
            <ImageOverlay
                url={mapImageUrl}
                bounds={bounds}
            />

            <MapController onRightClick={handleMapRightClick} bounds={bounds} />

            {/* 층수 전환 버튼 (레이어가 있는 경우에만 표시) - 줌 컨트롤 아래로 위치 조정 */}
            {currentMap.layers && (
                <div className="absolute top-24 right-4 z-[1000] flex flex-col gap-2 bg-black/80 p-2 rounded-lg border border-gray-700 backdrop-blur-sm">
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
                        opacity={marker.isApproved === false ? 0.5 : 1} // 승인 대기 중인 마커는 반투명하게 표시
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
