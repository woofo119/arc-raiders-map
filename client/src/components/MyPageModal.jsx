import { useState, useEffect, useMemo } from 'react';
import useStore from '../store/useStore';
import { X, User, Lock, Save, ChevronDown, ChevronUp } from 'lucide-react';
import LevelBadge from './LevelBadge';
import { calculateLevelInfo } from '../utils/levelLogic';

const MyPageModal = ({ onClose }) => {
    const { user, updateProfile } = useStore();
    const [nickname, setNickname] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [animatedProgress, setAnimatedProgress] = useState(0);

    // 레벨 정보 계산
    const levelInfo = useMemo(() => {
        if (!user?.points) return { level: 1, progress: 0, currentPoints: 0, nextPoints: 100 };
        return calculateLevelInfo(user.points);
    }, [user?.points]);

    // 경험치 바 애니메이션
    useEffect(() => {
        setAnimatedProgress(0);
        const timer = setTimeout(() => {
            setAnimatedProgress(levelInfo.progress);
        }, 100);
        return () => clearTimeout(timer);
    }, [levelInfo.progress]);

    useEffect(() => {
        if (user) {
            setNickname(user.nickname || user.username);
        }
    }, [user]);

    // 닉네임 변경 가능 여부 및 남은 일수 계산
    const nicknameChangeInfo = useMemo(() => {
        if (!user?.nicknameChangedAt) return { canChange: true, daysLeft: 0 };

        const lastChange = new Date(user.nicknameChangedAt);
        const now = new Date();
        const diffTime = now - lastChange;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const daysLeft = 30 - diffDays;

        return {
            canChange: diffDays >= 30,
            daysLeft: daysLeft > 0 ? daysLeft : 0
        };
    }, [user?.nicknameChangedAt]);

    // 역할 표시 이름
    const getRoleName = (role) => {
        const roles = {
            admin: 'ADMINISTRATOR',
            user: 'USER'
        };
        return roles[role] || 'USER';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nicknameChanged = nickname !== (user.nickname || user.username);

        if (nicknameChanged && !nicknameChangeInfo.canChange) {
            alert(`닉네임은 30일에 한 번만 변경할 수 있습니다. (${nicknameChangeInfo.daysLeft}일 후 변경 가능)`);
            return;
        }

        if (password && password !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (password && !currentPassword) {
            alert('현재 비밀번호를 입력해주세요.');
            return;
        }

        const result = await updateProfile(nickname, password || undefined, currentPassword || undefined);
        if (result.success) {
            alert('프로필이 업데이트되었습니다.');
            onClose();
        } else {
            alert(result.message);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* 프로필 헤더 - 레벨 정보 */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 mb-6 border border-gray-700/50">
                    <div className="flex items-center gap-4">
                        {/* 레벨 배지 */}
                        <LevelBadge level={levelInfo.level} size="w-12 h-12" />

                        {/* 유저 정보 */}
                        <div className="flex-1">
                            <p className="text-[10px] text-arc-accent font-bold tracking-wider uppercase">
                                {getRoleName(user.role)}
                            </p>
                            <p className="text-lg font-bold text-white">
                                {user.nickname || user.username}
                            </p>

                            {/* 레벨 진행 바 */}
                            <div className="mt-2">
                                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                    <span>Lv.{levelInfo.level}</span>
                                    <span>{Math.floor(levelInfo.progress)}%</span>
                                    <span>Lv.{levelInfo.level + 1}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-arc-accent to-orange-400 transition-all duration-700 ease-out"
                                        style={{ width: `${animatedProgress}%` }}
                                    />
                                </div>
                                <p className="text-right text-[10px] text-gray-300 mt-1 font-mono">
                                    {levelInfo.currentPoints?.toLocaleString() || 0} / {levelInfo.nextPoints?.toLocaleString() || 'MAX'} XP
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">아이디</label>
                        <div className="w-full bg-black/30 border border-gray-800 rounded-lg py-2 px-4 text-gray-500">
                            {user.username}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-400">닉네임</label>
                            {!nicknameChangeInfo.canChange && (
                                <span className="text-xs text-yellow-500">
                                    {nicknameChangeInfo.daysLeft}일 후 변경 가능
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="닉네임"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                disabled={!nicknameChangeInfo.canChange}
                                className={`w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-arc-accent focus:outline-none transition-colors ${!nicknameChangeInfo.canChange ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    {/* 비밀번호 변경 - 접이식 */}
                    <div className="pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                            className="flex items-center justify-between w-full text-sm font-medium text-gray-400 hover:text-white transition-colors py-2"
                        >
                            <span>비밀번호 변경</span>
                            {showPasswordSection ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showPasswordSection ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                            <div className="relative mb-3">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="현재 비밀번호"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-arc-accent focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="relative mb-3">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="새 비밀번호"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-arc-accent focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="새 비밀번호 확인"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-arc-accent focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-arc-accent hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-orange-900/20 active:scale-95 flex items-center justify-center gap-2 mt-6"
                    >
                        <Save size={18} />
                        저장하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MyPageModal;
