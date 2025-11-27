import useStore, { MAPS } from '../store/useStore';
import { Map, Filter, LogOut, User, Layers, Shield, Crosshair, ChevronDown } from 'lucide-react';

const Sidebar = () => {
    const { user, isAuthenticated, logout, filters, toggleFilter, currentMap, setMap, openLoginModal } = useStore();

    return (
        <div className="w-20 hover:w-72 bg-[#121212] border-r border-gray-800 flex flex-col h-full shadow-2xl z-[1000] transition-all duration-300 ease-in-out group/sidebar overflow-hidden">
            {/* 헤더 영역 */}
            <div className="p-6 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-[#121212] flex flex-col items-center overflow-hidden whitespace-nowrap">
                <div className="mb-6 flex justify-center w-full">
                    <img src="/logo.png" alt="ARC Raiders" className="h-8 object-contain transition-all duration-300 group-hover/sidebar:h-12" />
                </div>

                {/* 맵 선택 드롭다운 (확장 시 표시) */}
                <div className="relative w-full hidden group-hover/sidebar:block animate-in fade-in duration-300">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown size={16} />
                    </div>
                    <select
                        value={currentMap.id}
                        onChange={(e) => setMap(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 text-white text-sm rounded-lg p-3 appearance-none focus:border-arc-accent focus:outline-none transition-colors font-bold cursor-pointer hover:bg-black/70"
                    >
                        {MAPS.map((map) => (
                            <option key={map.id} value={map.id}>
                                {map.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 맵 아이콘 (축소 시 표시) */}
                <div className="block group-hover/sidebar:hidden text-gray-400">
                    <Map size={24} />
                </div>
            </div>

            {/* 필터 영역 */}
            <div className="p-6 flex-1 overflow-y-auto overflow-x-hidden">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 whitespace-nowrap">
                    <Filter size={14} />
                    <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100">
                        Filter Categories
                    </span>
                </h3>

                <div className="space-y-3">
                    <FilterItem
                        label="자원 (Resource)"
                        icon={<Layers size={20} className="text-emerald-400" />}
                        checked={filters.resource}
                        onChange={() => toggleFilter('resource')}
                        color="emerald"
                    />
                    <FilterItem
                        label="무기 (Weapon)"
                        icon={<Crosshair size={20} className="text-red-400" />}
                        checked={filters.weapon}
                        onChange={() => toggleFilter('weapon')}
                        color="red"
                    />
                    <FilterItem
                        label="퀘스트 (Quest)"
                        icon={<Shield size={20} className="text-blue-400" />}
                        checked={filters.quest}
                        onChange={() => toggleFilter('quest')}
                        color="blue"
                    />
                </div>

                {/* 안내 메시지 */}
                <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-200 whitespace-nowrap hidden group-hover/sidebar:block">
                    <h4 className="text-white text-sm font-bold mb-2">💡 사용 팁</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        지도에서 원하는 위치를 <span className="text-arc-accent font-bold">우클릭</span>하여<br />
                        새로운 마커를 추가할 수 있습니다.
                    </p>
                </div>
            </div>

            {/* 사용자 프로필 영역 */}
            <div className="p-4 border-t border-gray-800 bg-[#0f0f0f] overflow-hidden whitespace-nowrap">
                {isAuthenticated ? (
                    <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 flex items-center justify-between group hover:border-gray-700 transition-colors w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-700">
                                <User size={20} className="text-gray-300" />
                            </div>
                            <div className="flex flex-col opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75">
                                <span className="text-xs text-gray-500 font-bold uppercase">Operator</span>
                                <span className="text-sm font-bold text-white">{user.username}</span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover/sidebar:opacity-100"
                            title="로그아웃"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            console.log('로그인 버튼 클릭됨');
                            openLoginModal();
                        }}
                        className="w-full bg-gradient-to-r from-arc-accent to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl transition-all shadow-lg shadow-orange-900/20 font-bold text-sm flex items-center justify-center gap-2 group overflow-hidden"
                    >
                        <User size={20} className="min-w-[20px] group-hover:scale-110 transition-transform" />
                        <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
                            로그인 / 회원가입
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

// 필터 아이템 컴포넌트
const FilterItem = ({ label, icon, checked, onChange, color }) => (
    <label className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 border overflow-hidden whitespace-nowrap w-full
    ${checked
            ? `bg-gray-900 border-${color}-500/30 shadow-lg shadow-${color}-900/10`
            : 'bg-transparent border-transparent hover:bg-gray-900 hover:border-gray-800'
        }`}>
        <div className="min-w-[20px] flex items-center justify-center">
            {icon}
        </div>
        <div className="flex items-center justify-between flex-1 ml-3 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100">
            <span className={`text-sm font-medium ${checked ? 'text-white' : 'text-gray-500'}`}>{label}</span>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors
          ${checked ? `bg-${color}-500 border-${color}-500` : 'border-gray-700 bg-gray-800'}`}>
                {checked && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
        </div>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="hidden"
        />
    </label>
);

export default Sidebar;
