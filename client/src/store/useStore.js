import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'https://port-0-arc-server-mig6pxsra9d587bc.sel3.cloudtype.app';

// 맵 데이터 정의
export const MAPS = [
    { id: 'dam', name: '댐 전장 (Dam Battlefield)', image: '/map_dam.jpg' },
    { id: 'bluegate', name: '블루 게이트 (Blue Gate)', image: '/map_bluegate.jpg' },
    { id: 'buriedcity', name: '파묻힌 도시 (Buried City)', image: '/map_buriedcity.jpg' },
    { id: 'spacebase', name: '우주 기지 (Space Base)', image: '/map_spacebase.jpg' },
    { id: 'stellamontis', name: '스텔라 몬티스 (Stella Montis)', image: '/map_stellamontis.jpg' },
];

const useStore = create((set, get) => ({
    // --------------------------------------------------------------------------
    // 👤 사용자 인증 상태 (User Auth State)
    // --------------------------------------------------------------------------
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),

    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });
            const userData = response.data;
            localStorage.setItem('user', JSON.stringify(userData));
            set({ user: userData, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '로그인 실패' };
        }
    },

    register: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { username, password });
            const userData = response.data;
            localStorage.setItem('user', JSON.stringify(userData));
            set({ user: userData, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '회원가입 실패' };
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },

    // --------------------------------------------------------------------------
    // 🗺️ 지도 및 마커 상태 (Map & Marker State)
    // --------------------------------------------------------------------------
    currentMap: MAPS[0], // 현재 선택된 맵 (기본값: 댐 전장)
    markers: [],
    filters: {
        resource: true,
        weapon: true,
        quest: true,
    },

    // 맵 변경 액션
    setMap: (mapId) => {
        const map = MAPS.find(m => m.id === mapId);
        if (map) {
            set({ currentMap: map });
            get().fetchMarkers(); // 맵 변경 시 마커 다시 불러오기
        }
    },

    // 마커 목록 불러오기 (현재 맵 기준)
    fetchMarkers: async () => {
        const { currentMap } = get();
        try {
            const response = await axios.get(`${API_URL}/markers?mapId=${currentMap.id}`);
            set({ markers: response.data });
        } catch (error) {
            console.error('마커 불러오기 실패:', error);
        }
    },

    // 마커 추가하기
    addMarker: async (markerData) => {
        const { user, currentMap } = get();
        if (!user) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            // 현재 맵 ID를 포함하여 전송
            const dataWithMapId = { ...markerData, mapId: currentMap.id };

            const response = await axios.post(`${API_URL}/markers`, dataWithMapId, config);
            set((state) => ({ markers: [...state.markers, response.data] }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '마커 추가 실패' };
        }
    },

    deleteMarker: async (id) => {
        const { user } = get();
        if (!user) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`${API_URL}/markers/${id}`, config);
            set((state) => ({ markers: state.markers.filter((m) => m._id !== id) }));
        } catch (error) {
            console.error('마커 삭제 실패:', error);
        }
    },

    toggleFilter: (type) => {
        set((state) => ({
            filters: { ...state.filters, [type]: !state.filters[type] },
        }));
    },
}));

export default useStore;
