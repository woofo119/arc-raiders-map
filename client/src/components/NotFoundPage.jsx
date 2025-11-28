import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="max-w-2xl w-full mb-8">
                <img
                    src="/error-404.png"
                    alt="404 Not Found"
                    className="w-full h-auto object-contain rounded-xl shadow-2xl border border-gray-800"
                />
            </div>

            <h1 className="text-4xl font-bold mb-4 text-center">Page Not Found</h1>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                요청하신 페이지를 찾을 수 없습니다. 주소를 다시 확인하시거나 홈으로 돌아가세요.
            </p>

            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-arc-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105"
            >
                <Home size={20} />
                홈으로 돌아가기
            </button>
        </div>
    );
};

export default NotFoundPage;
