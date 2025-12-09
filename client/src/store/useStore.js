import { create } from 'zustand';
import axios from 'axios';
import { MAPS, MARKER_CATEGORIES } from '../constants';

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

    checkAuth: async () => {
        const { user } = get();
        if (!user) return; // Not logged in locally

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.get(`${API_URL}/auth/me`, config);
            const updatedUser = { ...user, ...response.data }; // Keep token, update profile info

            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist update
            set({ user: updatedUser });
            get().fetchNotifications(); // 알림 불러오기
        } catch (error) {
            console.error('Auth check failed:', error);
            // Optional: if 401, logout? For now just log error.
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
    currentMap: (() => {
        const savedMapId = localStorage.getItem('currentMapId');
        return MAPS.find(m => m.id === savedMapId) || MAPS[0];
    })(), // 저장된 맵이 있으면 사용, 없으면 기본값

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
            localStorage.setItem('currentMapId', mapId); // 맵 ID 저장
            set({ currentMap: map });
            get().fetchMarkers(); // 맵 변경 시 마커 다시 불러오기
        }
    },

    // 마커 목록 불러오기 (현재 맵 기준)
    fetchMarkers: async () => {
        const { currentMap, user } = get();
        try {
            // 관리자라면 /api/markers/admin 호출 (승인 대기 포함), 아니면 /api/markers (승인된 것만)
            const endpoint = (user && user.role === 'admin')
                ? `${API_URL}/markers/admin`
                : `${API_URL}/markers`;

            // 관리자 API 호출 시에는 토큰 헤더 필요
            const config = (user && user.role === 'admin')
                ? { headers: { Authorization: `Bearer ${user.token}` } }
                : {};

            const response = await axios.get(`${endpoint}?mapId=${currentMap.id}`, config);
            set({ markers: response.data });
        } catch (error) {
            console.error('마커 불러오기 실패:', error);
        }
    },

    // 마커 추가하기 (제안하기)
    addMarker: async (markerData) => {
        const { user, currentMap } = get();
        if (!user) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            // 현재 맵 ID를 포함하여 전송 (layer 정보는 markerData에 포함되어 있음)
            const dataWithMapId = { ...markerData, mapId: currentMap.id };

            const response = await axios.post(`${API_URL}/markers`, dataWithMapId, config);

            // 관리자가 아니면 제안 상태이므로 바로 리스트에 추가하지 않음 (또는 pending 상태로 추가)
            // 여기서는 서버 응답의 isApproved를 확인
            const newMarker = response.data;

            if (newMarker.isApproved) {
                set((state) => ({ markers: [...state.markers, newMarker] }));
                return { success: true, message: '마커가 추가되었습니다.' };
            } else {
                return { success: true, message: '마커 추가 제안이 접수되었습니다. 관리자 승인 후 표시됩니다.' };
            }
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

    // 마커 승인하기 (관리자용)
    approveMarker: async (id) => {
        const { user } = get();
        if (!user || user.role !== 'admin') return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.put(`${API_URL}/markers/${id}`, { isApproved: true }, config);
            const updatedMarker = response.data;

            set((state) => ({
                markers: state.markers.map((m) => (m._id === id ? updatedMarker : m)),
            }));
            return { success: true };
        } catch (error) {
            console.error('마커 승인 실패:', error);
            return { success: false, message: '마커 승인 실패' };
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

    // 모든 필터 켜기
    showAllFilters: () => {
        set((state) => {
            const newFilters = { ...state.filters };
            Object.keys(newFilters).forEach(key => {
                newFilters[key] = true;
            });
            return { filters: newFilters };
        });
    },

    // 모든 필터 끄기
    hideAllFilters: () => {
        set((state) => {
            const newFilters = { ...state.filters };
            Object.keys(newFilters).forEach(key => {
                newFilters[key] = false;
            });
            return { filters: newFilters };
        });
    },

    // --------------------------------------------------------------------------
    // 🖼️ UI 상태 (Modals) - 로그인 창 열고 닫기 (추가된 부분!)
    // --------------------------------------------------------------------------
    isLoginModalOpen: false, // 모달이 열렸는지 닫혔는지 저장
    isMyPageModalOpen: false, // 마이페이지 모달 상태
    isNavMenuOpen: false, // Quick Nav Popup State

    openLoginModal: () => set({ isLoginModalOpen: true }), // 열기 함수
    closeLoginModal: () => set({ isLoginModalOpen: false }), // 닫기 함수

    openMyPageModal: () => set({ isMyPageModalOpen: true }),
    closeMyPageModal: () => set({ isMyPageModalOpen: false }),

    // --------------------------------------------------------------------------
    // 📝 게시판 상태 (Community Board State)
    // --------------------------------------------------------------------------
    posts: [],
    currentPost: null,

    // --------------------------------------------------------------------------
    // ⚔️ 무기 DB 상태 (Weapon DB State)
    // --------------------------------------------------------------------------
    weapons: [],

    clearCurrentPost: () => set({ currentPost: null }),

    fetchPosts: async () => {
        try {
            const response = await axios.get(`${API_URL}/posts`);
            set({ posts: response.data });
        } catch (error) {
            console.error('게시글 불러오기 실패:', error);
        }
    },

    fetchPost: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/posts/${id}`);
            set({ currentPost: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('게시글 상세 조회 실패:', error);
            return { success: false, message: '게시글을 불러올 수 없습니다.' };
        }
    },

    createPost: async (title, content, category, images) => {
        const { user } = get();
        if (!user) return { success: false, message: '로그인이 필요합니다.' };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.post(`${API_URL}/posts`, { title, content, category, images }, config);
            set((state) => ({ posts: [response.data, ...state.posts] }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '게시글 작성 실패' };
        }
    },

    updatePost: async (id, title, content, category, images) => {
        const { user } = get();
        if (!user) return { success: false, message: '로그인이 필요합니다.' };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.put(`${API_URL}/posts/${id}`, { title, content, category, images }, config);
            const updatedPost = response.data;

            set((state) => ({
                posts: state.posts.map(p => p._id === id ? updatedPost : p),
                currentPost: state.currentPost?._id === id ? updatedPost : state.currentPost
            }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '게시글 수정 실패' };
        }
    },

    deletePost: async (id) => {
        const { user } = get();
        if (!user) return { success: false, message: '로그인이 필요합니다.' };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`${API_URL}/posts/${id}`, config);
            set((state) => ({
                posts: state.posts.filter(p => p._id !== id),
                currentPost: null
            }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '게시글 삭제 실패' };
        }
    },

    addComment: async (postId, content, parentId = null) => {
        const { user } = get();
        if (!user) return { success: false, message: '로그인이 필요합니다.' };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            // parentId param added
            const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content, parentId }, config);
            set({ currentPost: response.data });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '댓글 작성 실패' };
        }
    },

    deleteComment: async (postId, commentId) => {
        const { user } = get();
        if (!user) return { success: false, message: '로그인이 필요합니다.' };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`, config);
            set({ currentPost: response.data });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '댓글 삭제 실패' };
        }
    },

    toggleLike: async (postId, target = 'post', commentId = null) => {
        const { user } = get();
        if (!user) return { success: false, message: '로그인이 필요합니다.' };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            // Updated payload for generic like toggle
            const response = await axios.put(`${API_URL}/posts/${postId}/like`, { target, commentId }, config);
            const updatedData = response.data; // This returns { likes, dislikes, target } but we need full post update for simpler state management?
            // Actually controller returns: res.json({ likes: targetObj.likes, dislikes: targetObj.dislikes, target: target });
            // This is insufficient to update key parts of state if we rely on full object replacement.
            // However, we can re-fetch the post or manually update the local state. 
            // Better to Re-fetch post to ensure consistency or update blindly.
            // Let's refetch post for simplicity and correctness, or manually patch.

            // To be safe and see points update etc, let's just refetch the post.
            // Or rely on the fact that existing code expected updatedPost object.
            // The previous controller returned updatedPost. My new controller returned partial data. 
            // Wait, previous controller: `res.json(updatedPost);`
            // My new controller: `res.json({ likes: targetObj.likes ... })`
            // This BREAKS existing frontend expectation which sets `currentPost: updatedPost`.

            // I should FIX THE CONTROLLER to return the full Post object, 
            // OR update Frontend to handle partial update. Refetching is safest but slower.
            // Let's change this to refetch.

            const postRes = await axios.get(`${API_URL}/posts/${postId}`);
            set({ currentPost: postRes.data });

            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '좋아요 처리 실패' };
        }
    },

    // --------------------------------------------------------------------------
    // 💾 UI 상태 (Persisted UI State) - 마커 생성 폼 설정 기억
    fetchWeapons: async () => {
        try {
            const response = await axios.get(`${API_URL}/weapons`);
            set({ weapons: response.data });
        } catch (error) {
            console.error('무기 불러오기 실패:', error);
        }
    },

    createWeapon: async (weaponData) => {
        const { user } = get();
        if (!user || user.role !== 'admin') return { success: false, message: '권한이 없습니다.' };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.post(`${API_URL}/weapons`, weaponData, config);
            set((state) => ({ weapons: [response.data, ...state.weapons] }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '무기 등록 실패' };
        }
    },

    deleteWeapon: async (id) => {
        const { user } = get();
        if (!user || user.role !== 'admin') return { success: false, message: '권한이 없습니다.' };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`${API_URL}/weapons/${id}`, config);
            set((state) => ({ weapons: state.weapons.filter(w => w._id !== id) }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || '무기 삭제 실패' };
        }
    },

    // --------------------------------------------------------------------------
    // 🔔 알림 상태 (Notification State)
    // --------------------------------------------------------------------------
    notifications: [],
    unreadCount: 0,

    fetchNotifications: async () => {
        const { user } = get();
        if (!user) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.get(`${API_URL}/notifications`, config);
            const notifications = response.data;
            const unreadCount = notifications.filter(n => !n.isRead).length;

            set({ notifications, unreadCount });
        } catch (error) {
            console.error('알림 불러오기 실패:', error);
        }
    },

    markNotificationAsRead: async (id) => {
        const { user, notifications } = get();
        if (!user) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`${API_URL}/notifications/${id}/read`, {}, config);

            // 로컬 상태 업데이트
            const updatedNotifications = notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            );
            const unreadCount = updatedNotifications.filter(n => !n.isRead).length;

            set({ notifications: updatedNotifications, unreadCount });
        } catch (error) {
            console.error('알림 읽음 처리 실패:', error);
        }
    },

    markAllNotificationsAsRead: async () => {
        const { user, notifications } = get();
        if (!user) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`${API_URL}/notifications/read-all`, {}, config);

            const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
            set({ notifications: updatedNotifications, unreadCount: 0 });
        } catch (error) {
            console.error('전체 알림 읽음 처리 실패:', error);
        }
    },

    deleteAllNotifications: async () => {
        const { user } = get();
        if (!user) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`${API_URL}/notifications`, config);

            set({ notifications: [], unreadCount: 0 });
        } catch (error) {
            console.error('전체 알림 삭제 실패:', error);
        }
    },
}));

export default useStore;
