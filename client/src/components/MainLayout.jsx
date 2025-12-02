import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import LoginModal from './LoginModal';
import MyPageModal from './MyPageModal';
import ChatWidget from './ChatWidget';
import useStore from '../store/useStore';

const MainLayout = () => {
    const { isLoginModalOpen, closeLoginModal, isMyPageModalOpen, closeMyPageModal } = useStore();

    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans selection:bg-arc-accent selection:text-white">
            <Sidebar />
            <div className="flex-1 relative flex flex-col h-full overflow-hidden">
                <Outlet />
            </div>
            <ChatWidget />
        </div>
    );
};

export default MainLayout;
