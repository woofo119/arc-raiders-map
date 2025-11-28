import React from 'react';
import Sidebar from './Sidebar';
import MapContainer from './MapContainer';
import LoginModal from './LoginModal';
import MyPageModal from './MyPageModal';
import ChatWidget from './ChatWidget';
import useStore from '../store/useStore';

const MapPage = () => {
    const { isLoginModalOpen, closeLoginModal, isMyPageModalOpen, closeMyPageModal } = useStore();

    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans">
            <Sidebar />
            <MapContainer />
            <ChatWidget />

            {isLoginModalOpen && (
                <LoginModal onClose={closeLoginModal} />
            )}

            {isMyPageModalOpen && (
                <MyPageModal onClose={closeMyPageModal} />
            )}
        </div>
    );
};

export default MapPage;
