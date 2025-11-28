import { useState } from 'react';
import useStore from '../store/useStore';
import { X, User, Lock, ArrowRight, Mail } from 'lucide-react';

const LoginModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // 약간의 지연 효과로 UX 개선
        await new Promise(resolve => setTimeout(resolve, 500));

        let result;
        if (isLogin) {
            result = await login(username, password);
        } else {
            result = await register(username, email, password, nickname);
        }

        setIsLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[2000] animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden group">

                {/* 배경 장식 효과 */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-arc-accent to-transparent opacity-50"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-arc-accent/10 rounded-full blur-3xl group-hover:bg-arc-accent/20 transition-all duration-500"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Join the Squad'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin ? 'ARC Raiders KR에 로그인하세요.' : '새로운 계정을 생성하고 작전을 시작하세요.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center justify-center animate-in slide-in-from-top-2">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">아이디</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="아이디를 입력하세요"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-arc-accent focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">닉네임</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="사용할 닉네임을 입력하세요"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-arc-accent focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">이메일</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                                        <input
                                            type="email"
                                            placeholder="이메일을 입력하세요"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-arc-accent focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">비밀번호</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-arc-accent focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-arc-accent hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-arc-accent/20 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                {isLogin ? '로그인' : '계정 생성'} <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-gray-500 hover:text-arc-accent transition-colors underline underline-offset-4"
                    >
                        {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
