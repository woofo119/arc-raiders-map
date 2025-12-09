import { useState, useEffect, useMemo } from 'react';
import useStore from '../store/useStore';
import { X, User, Lock, Save, ChevronDown, ChevronUp } from 'lucide-react';

const MyPageModal = ({ onClose }) => {
    const { user, updateProfile } = useStore();
    const [nickname, setNickname] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordSection, setShowPasswordSection] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 닉네임이 변경되었는지 확인
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
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">마이 페이지</h2>
                    <p className="text-gray-400 text-sm">내 정보를 수정하세요</p>
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

                        {/* 비밀번호 입력 필드 - 접이식 애니메이션 */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showPasswordSection ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                            {/* 현재 비밀번호 */}
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

                            {/* 새 비밀번호 */}
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

                            {/* 새 비밀번호 확인 */}
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
