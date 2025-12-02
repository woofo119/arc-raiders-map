import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { MessageSquare, PenTool, HelpCircle, Zap, Shield, Activity, User, LogOut, ChevronRight, Map as MapIcon } from 'lucide-react';

const CommunitySidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout, openLoginModal, openMyPageModal } = useStore();

    const communityCategories = [
        { id: 'free', label: '자유게시판', icon: <MessageSquare size={18} /> },
        { id: 'tips', label: '공략 / 팁', icon: <PenTool size={18} /> },
        { id: 'qna', label: '질문게시판', icon: <HelpCircle size={18} /> },
    ];

    return (
        <div className="w-64 bg-[#121212] border-r border-gray-800 flex flex-col h-full shadow-2xl z-[1000] transition-all duration-300 ease-in-out overflow-hidden">
            {/* Header */}
            <div className="py-6 px-6 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-[#121212] flex flex-col items-center">
                <div
                    className="mb-6 flex justify-center w-full h-12 items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <img src="/logo_white.png" alt="ARC Raiders" className="h-12 object-contain" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                {/* Community Section */}
                <div>
                    <div className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">게시판</div>
                    <div className="space-y-1">
                        {communityCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => navigate(`/community?category=${cat.id}`)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${location.pathname === '/community' && location.search.includes(`category=${cat.id}`)
                                    ? 'bg-arc-accent text-white font-bold'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                {cat.icon}
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Map Info Section */}
                <div>
                    <div className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">맵 정보</div>
                    <button
                        onClick={() => navigate('/map')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${location.pathname === '/map'
                            ? 'bg-arc-accent text-white font-bold'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <MapIcon size={18} />
                        <span>지도 보기</span>
                    </button>
                </div>

                {/* Skill Tree Section */}
                <div>
                    <div className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">스킬 트리</div>
                    <button
                        onClick={() => navigate('/skills')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${location.pathname === '/skills'
                            ? 'bg-arc-accent text-white font-bold'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <Zap size={18} />
                        <span>스킬 시뮬레이터</span>
                    </button>
                </div>
            </div>

            {/* User Profile */}
            <div className="py-4 px-4 border-t border-gray-800 bg-[#0f0f0f]">
                {isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                        {user.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 mb-2"
                            >
                                <Shield size={14} />
                                ADMIN DASHBOARD
                            </button>
                        )}
                        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 flex items-center justify-between group hover:border-gray-700 transition-colors w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-700">
                                    <User size={20} className="text-gray-300" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs text-gray-500 font-bold uppercase">{user.role === 'admin' ? 'Administrator' : 'Operator'}</span>
                                    <button
                                        onClick={openMyPageModal}
                                        className="text-sm font-bold text-white hover:text-arc-accent text-left transition-colors truncate"
                                    >
                                        {user.nickname || user.username}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                                title="로그아웃"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={openLoginModal}
                        className="w-full bg-gradient-to-r from-arc-accent to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl transition-all shadow-lg shadow-orange-900/20 font-bold text-sm flex items-center justify-center gap-2 group"
                    >
                        <User size={20} className="group-hover:scale-110 transition-transform" />
                        <span>로그인 / 회원가입</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommunitySidebar;
