import Sidebar from './components/Sidebar';
import MapContainer from './components/MapContainer';
import LoginModal from './components/LoginModal';
import MyPageModal from './components/MyPageModal';
import ChatWidget from './components/ChatWidget';
import useStore from './store/useStore';

function App() {
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
}

export default App;
