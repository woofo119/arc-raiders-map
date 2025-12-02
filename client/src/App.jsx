import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MapContainer from './components/MapContainer';
import SkillTreePage from './components/SkillTreePage';
import CommunityPage from './components/CommunityPage';
import PostWritePage from './components/PostWritePage';
import PostDetailPage from './components/PostDetailPage';
import NotFoundPage from './components/NotFoundPage';
import MainLayout from './components/MainLayout';
import LoginModal from './components/LoginModal';
import MyPageModal from './components/MyPageModal';
import useStore from './store/useStore';
import { useEffect } from 'react';

const App = () => {
    const { checkAuth, isLoginModalOpen, closeLoginModal, isMyPageModalOpen, closeMyPageModal } = useStore();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <Router>
            <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-arc-accent selection:text-white">
                <div className="flex-1 relative flex flex-col h-full overflow-hidden">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />

                        {/* 맵과 스킬 트리는 사이드바가 있는 레이아웃 사용 */}
                        <Route element={<MainLayout />}>
                            <Route path="/map" element={<MapContainer />} />
                            <Route path="/skills" element={<SkillTreePage />} />
                        </Route>

                        {/* 커뮤니티는 별도 레이아웃 (전체 화면) */}
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/community/write" element={<PostWritePage />} />
                        <Route path="/community/:id" element={<PostDetailPage />} />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>

                    {/* 전역 모달 */}
                    {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
                    {isMyPageModalOpen && <MyPageModal onClose={closeMyPageModal} />}
                </div>
            </div>
        </Router>
    );
};

export default App;
