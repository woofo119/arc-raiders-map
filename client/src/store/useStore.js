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
    // --------------------------------------------------------------------------
    // 🗺️ 지도 및 마커 상태 (Map & Marker State)
    // --------------------------------------------------------------------------
    currentMap: MAPS[0], // 현재 선택된 맵 (기본값: 댐 전장)
    markers: [],

    // 필터 초기 상태 동적 생성
    filters: (() => {
        const initial = {};
        Object.keys(MARKER_CATEGORIES).forEach(cat => {
            initial[cat] = true; // 카테고리 전체 (예: nature)
            MARKER_CATEGORIES[cat].types.forEach(type => {
                initial[type.id] = true; // 개별 아이템 (예: mushroom)
            });
        });
        return initial;
    })(),

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

    updateMarker: async (id, title, description, image) => {
        const { user } = get();
        if (!user) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.put(`${API_URL}/markers/${id}`, { title, description, image }, config);
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

    toggleFilter: (id) => {
        set((state) => {
            const newFilters = { ...state.filters };

            // 1. 메인 카테고리를 토글한 경우
            if (MARKER_CATEGORIES[id]) {
                const newValue = !newFilters[id];
                newFilters[id] = newValue;
                // 해당 카테고리의 모든 하위 아이템도 동일하게 설정
                MARKER_CATEGORIES[id].types.forEach(t => {
                    newFilters[t.id] = newValue;
                });
            }
            // 2. 하위 아이템을 토글한 경우
            else {
                newFilters[id] = !newFilters[id];

                // 부모 카테고리 찾기
                let parentCat = null;
                for (const cat in MARKER_CATEGORIES) {
                    if (MARKER_CATEGORIES[cat].types.find(t => t.id === id)) {
                        parentCat = cat;
                        break;
                    }
                }

                // 부모 카테고리 상태 업데이트 (모든 자식이 켜져있으면 켜짐, 하나라도 꺼지면 꺼짐)
                // 또는 UX에 따라 "하나라도 켜져있으면 켜짐"으로 할 수도 있지만, 보통은 전체 선택/해제 로직을 따름
                // 여기서는 "모두 선택되었을 때만 부모 체크" 로직 사용
                if (parentCat) {
                    const allChildren = MARKER_CATEGORIES[parentCat].types;
                    const allChecked = allChildren.every(t => newFilters[t.id]);
                    newFilters[parentCat] = allChecked;
                }
            }
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
