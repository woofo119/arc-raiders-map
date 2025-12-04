import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import CommunitySidebar from './CommunitySidebar';
import LoginModal from './LoginModal';
import MyPageModal from './MyPageModal';
import useStore from '../store/useStore';

const CommunityLayout = () => {
    const { isLoginModalOpen, closeLoginModal, isMyPageModalOpen, closeMyPageModal } = useStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans selection:bg-arc-accent selection:text-white">
            {/* Mobile Sidebar Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-4 left-4 z-[1001] lg:hidden bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-full border border-gray-700 shadow-lg transition-colors"
                aria-label="Toggle Sidebar"
            >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[999] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <CommunitySidebar isOpen={isSidebarOpen} />
            <div className="flex-1 relative flex flex-col h-full overflow-hidden lg:ml-64">
                <Outlet />
            </div>
        </div>
    );
};


export default CommunityLayout;
