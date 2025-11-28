import { create } from 'zustand';
import axios from 'axios';
import { MAPS } from '../constants';

// ⚠️ VITE 환경변수를 무시하고, 최종 배포 주소로 고정합니다.
const API_URL = 'https://port-0-arc-server-mig6pxsra9d587bc.sel3.cloudtype.app/api';

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
            console.error('로그인 에러:', error);
            return { success: false, message: error.response?.data?.message || error.message || '로그인 실패' };
        }
    },

    register: async (username, email, password, nickname) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { username, email, password, nickname });
            const userData = response.data;
            localStorage.setItem('user', JSON.stringify(userData));
            set({ user: userData, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            console.error('회원가입 에러:', error);
            return { success: false, message: error.response?.data?.message || error.message || '회원가입 실패' };
        }
    },

    updateProfile: async (nickname, password) => {
        const { user } = get();
        if (!user) return { success: false, message: '로그인이 필요합니다.' };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.put(`${API_URL}/auth/profile`, { nickname, password }, config);
            const updatedUser = response.data;

            // 로컬 스토리지 및 상태 업데이트
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
            return { success: true };
        } catch (error) {
            console.error('프로필 업데이트 에러:', error);
            return { success: false, message: error.response?.data?.message || '프로필 업데이트 실패' };
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

    // 초기 필터 상태: 모든 하위 카테고리(sub-type)를 true로 설정
    filters: Object.values(MARKER_CATEGORIES).reduce((acc, category) => {
        category.types.forEach(type => {
            acc[type.id] = true;
        });
        return acc;
    }, {}),

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

    updateMarker: async (id, title, description, x, y) => {
        const { user } = get();
        if (!user) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const payload = { title, description };
            if (x !== undefined) payload.x = x;
            if (y !== undefined) payload.y = y;

            const response = await axios.put(`${API_URL}/markers/${id}`, payload, config);
            const updatedMarker = response.data;

            set((state) => ({
                markers: state.markers.map((m) => (m._id === id ? updatedMarker : m)),
            }));
            return { success: true };
        } catch (error) {
            console.error('마커 수정 실패:', error);
            return { success: false, message: error.response?.data?.message || '마커 수정 실패' };
        }
    },

    // 개별 필터 토글 (Sub-type ID 기준)
    toggleFilter: (typeId) => {
        set((state) => ({
            filters: { ...state.filters, [typeId]: !state.filters[typeId] },
        }));
    },

    // 카테고리 전체 토글
    toggleCategory: (mainType, forceState = null) => {
        set((state) => {
            const category = MARKER_CATEGORIES[mainType];
            if (!category) return state;

            const typeIds = category.types.map(t => t.id);

            // forceState가 없으면: 현재 모두 켜져있으면 끄기, 하나라도 꺼져있으면 켜기
            const allActive = typeIds.every(id => state.filters[id]);
            const newState = forceState !== null ? forceState : !allActive;

            const newFilters = { ...state.filters };
            typeIds.forEach(id => {
                newFilters[id] = newState;
            });

            return { filters: newFilters };
        });
    },

    // --------------------------------------------------------------------------
    // 🖼️ UI 상태 (Modals) - 로그인 창 열고 닫기 (추가된 부분!)
    // --------------------------------------------------------------------------
    isLoginModalOpen: false, // 모달이 열렸는지 닫혔는지 저장
    isMyPageModalOpen: false, // 마이페이지 모달 상태

    openLoginModal: () => set({ isLoginModalOpen: true }), // 열기 함수
    closeLoginModal: () => set({ isLoginModalOpen: false }), // 닫기 함수

    openMyPageModal: () => set({ isMyPageModalOpen: true }),
    closeMyPageModal: () => set({ isMyPageModalOpen: false }),
}));

export default useStore;
