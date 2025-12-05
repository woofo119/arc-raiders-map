import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';
import SkillTreePage from './components/SkillTreePage';
import CommunityPage from './components/CommunityPage';
import PostWritePage from './components/PostWritePage';
import PostDetailPage from './components/PostDetailPage';
import NotFoundPage from './components/NotFoundPage';
import MainLayout from './components/MainLayout';
import CommunityLayout from './components/CommunityLayout';
import LoginModal from './components/LoginModal';
import MyPageModal from './components/MyPageModal';
import AdminPage from './pages/AdminPage';
import WeaponDBPage from './components/WeaponDBPage';
import WeaponDetailPage from './components/WeaponDetailPage';
import ErrorBoundary from './components/ErrorBoundary';
import useStore from './store/useStore';

const App = () => {
    const { isLoginModalOpen, closeLoginModal, isMyPageModalOpen, closeMyPageModal } = useStore();

    return (
        <Router>
            <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-arc-accent selection:text-white">
                <div className="flex-1 relative flex flex-col h-full overflow-hidden">
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />

                            {/* 맵은 기존 MainLayout (Map Sidebar 포함) 사용 */}
                            <Route element={<MainLayout />}>
                                <Route path="/map" element={<MapPage />} />
                            </Route>

                            {/* 스킬 트리와 커뮤니티는 CommunityLayout (Community Sidebar 포함) 사용 */}
                            <Route element={<CommunityLayout />}>
                                <Route path="/skills" element={<SkillTreePage />} />
                                <Route path="/community" element={<CommunityPage />} />
                                <Route path="/community/write" element={<PostWritePage />} />
                                <Route path="/community/edit/:id" element={<PostWritePage />} />
                                <Route path="/community/:id" element={<PostDetailPage />} />
                                <Route path="/weapons" element={<WeaponDBPage />} />
                                <Route path="/weapons/:id" element={<WeaponDetailPage />} />
                            </Route>

                            {/* 관리자 페이지 */}
                            <Route path="/admin" element={<AdminPage />} />

                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </ErrorBoundary>

                    {/* 전역 모달 */}
                    {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
                    {isMyPageModalOpen && <MyPageModal onClose={closeMyPageModal} />}
                </div>
            </div>
        </Router>
    );
};

export default App;
