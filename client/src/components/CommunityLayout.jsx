import { Outlet } from 'react-router-dom';
import CommunitySidebar from './CommunitySidebar';
import LoginModal from './LoginModal';
import MyPageModal from './MyPageModal';
import ChatWidget from './ChatWidget';
import useStore from '../store/useStore';

const CommunityLayout = () => {
    const { isLoginModalOpen, closeLoginModal, isMyPageModalOpen, closeMyPageModal } = useStore();

    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans selection:bg-arc-accent selection:text-white">
            <CommunitySidebar />
            <div className="flex-1 relative flex flex-col h-full overflow-hidden">
                <Outlet />
            </div>
            {/* ChatWidget can be included if desired, or omitted for community pages */}
            <ChatWidget />
        </div>
    );
};

export default CommunityLayout;
