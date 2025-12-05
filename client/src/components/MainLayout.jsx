import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Map, Zap, MessageSquare, Menu, X, Database, Settings } from 'lucide-react';
import LoginModal from './LoginModal';
import MyPageModal from './MyPageModal';
import useStore from '../store/useStore';

const MainLayout = () => {
    const { isLoginModalOpen, closeLoginModal, isMyPageModalOpen, closeMyPageModal, user } = useStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans selection:bg-arc-accent selection:text-white">
            {/* Mobile Header / Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-md border-b border-gray-800 z-[1001] flex items-center justify-between px-4">
                <div onClick={() => navigate('/')} className="h-8 cursor-pointer">
                    <img src="/logo_white.png" alt="ARC Raiders" className="h-full object-contain" />
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-400 hover:text-white"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Navigation Sidebar */}
            <nav className={`fixed lg:static inset-y-0 left-0 w-20 bg-[#111] border-r border-gray-800 flex flex-col items-center py-6 gap-8 z-[1000] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } lg:pt-6 pt-20`}>

                {/* Logo (Desktop) */}
                <div onClick={() => navigate('/')} className="hidden lg:block w-12 h-12 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src="/logo_icon.png" alt="Logo" className="w-full h-full object-contain" />
                </div>

                {/* Nav Links */}
                <div className="flex flex-col gap-6 w-full items-center">
                    <div className="flex flex-col items-center group">
                        <NavLink
                            to="/map"
                            className={({ isActive }) =>
                                `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-br from-arc-accent to-orange-600 text-white shadow-[0_0_15px_rgba(255,107,0,0.5)] border border-orange-500/50'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`
                            }
                        >
                            <Map size={24} strokeWidth={1.5} />
                        </NavLink>
                        <span className="text-[10px] mt-1 text-gray-500 font-medium group-hover:text-gray-300 transition-colors">지 도</span>
                    </div>

                    <div className="flex flex-col items-center group">
                        <NavLink
                            to="/skills"
                            className={({ isActive }) =>
                                `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-br from-green-600 to-green-800 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)] border border-green-400/50'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`
                            }
                        >
                            <Zap size={24} strokeWidth={1.5} />
                        </NavLink>
                        <span className="text-[10px] mt-1 text-gray-500 font-medium group-hover:text-gray-300 transition-colors">스킬</span>
                    </div>

                    <div className="flex flex-col items-center group">
                        <NavLink
                            to="/community"
                            className={({ isActive }) =>
                                `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/50'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`
                            }
                        >
                            <MessageSquare size={24} strokeWidth={1.5} />
                        </NavLink>
                        <span className="text-[10px] mt-1 text-gray-500 font-medium group-hover:text-gray-300 transition-colors">커뮤니티</span>
                    </div>

                    {/* NEW: Weapon DB Link */}
                    <div className="flex flex-col items-center group">
                        <NavLink
                            to="/weapons"
                            className={({ isActive }) =>
                                `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-400/50'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`
                            }
                        >
                            <Database size={24} strokeWidth={1.5} />
                        </NavLink>
                        <span className="text-[10px] mt-1 text-gray-500 font-medium group-hover:text-gray-300 transition-colors">무기 DB</span>
                    </div>

                    {/* Admin Link (Only for admin) */}
                    {user && user.role === 'admin' && (
                        <div className="flex flex-col items-center group mt-4 pt-4 border-t border-gray-800 w-12">
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    `w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-red-900/50 text-red-500 border border-red-800'
                                        : 'text-gray-500 hover:text-red-400 hover:bg-gray-800'
                                    }`
                                }
                            >
                                <Settings size={20} strokeWidth={1.5} />
                            </NavLink>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col h-full overflow-hidden pt-14 lg:pt-0">
                <Outlet />
            </div>

            {/* Custom Modals */}
            {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
            {isMyPageModalOpen && <MyPageModal onClose={closeMyPageModal} />}
        </div>
    );
};

export default MainLayout;
