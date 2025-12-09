import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { MAPS, MARKER_CATEGORIES } from '../constants';
import { Map as MapIcon, Filter as FilterIcon, LogOut, User, Layers, Shield, Crosshair, ChevronDown, Home, Zap, Users } from 'lucide-react';
import LevelBadge from './LevelBadge';
import ExperienceBar from './ExperienceBar';

const Sidebar = ({ isOpen = false }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, filters, toggleFilter, currentMap, setMap, openLoginModal, openMyPageModal } = useStore();

    return (
        <div className={`absolute left-0 top-0 h-full w-72 bg-[#121212] border-r border-gray-800 flex flex-col shadow-2xl z-[3000] transition-transform duration-300 ease-in-out overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            {/* 헤더 영역 */}
            <div className="py-6 px-6 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-[#121212] flex flex-col items-center overflow-hidden whitespace-nowrap">
                <div
                    className="mb-6 flex justify-center w-full h-12 items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <img src="/logo_white.png" alt="ARC Raiders" className="h-12 object-contain" />
                </div>

                {/* 맵 선택 드롭다운 */}
                <div className="relative w-full block animate-in fade-in duration-300">
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
            </div>

            {/* 필터 영역 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 scrollbar-hide">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-between gap-2 whitespace-nowrap h-6">
                    <div className="flex items-center gap-2">
                        <FilterIcon size={16} className="min-w-[16px]" />
                        <span className="opacity-100 inline">
                            FILTER CATEGORIES
                        </span>
                    </div>
                </h3>

                {/* 전체 제어 버튼 */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={useStore.getState().showAllFilters}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 py-1.5 rounded border border-gray-700 transition-colors"
                    >
                        Show All
                    </button>
                    <button
                        onClick={useStore.getState().hideAllFilters}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 py-1.5 rounded border border-gray-700 transition-colors"
                    >
                        Hide All
                    </button>
                </div>

                <div className="space-y-2 flex flex-col items-stretch">
                    {Object.entries(MARKER_CATEGORIES).map(([key, category]) => (
                        <AccordionFilter
                            key={key}
                            mainType={key}
                            category={category}
                        />
                    ))}
                </div>
            </div>

            {/* 사용자 프로필 영역 및 네비게이션 트리거 */}
            <div className="py-4 px-4 border-t border-gray-800 bg-[#0f0f0f] overflow-hidden whitespace-nowrap flex flex-col gap-2 relative">

                {/* Navigation Popup Menu (Animate from bottom) */}
                <div className={`absolute bottom-full left-0 w-full bg-[#1a1a1a] border-t border-r border-gray-800 rounded-t-xl transition-all duration-300 ease-out transform ${isOpen && useStore.getState().isNavMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                    <div className="p-2 grid grid-cols-2 gap-2">
                        <div
                            onClick={() => navigate('/')}
                            className="flex flex-col items-center justify-center p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                        >
                            <Home size={20} className="mb-1 text-gray-400" />
                            <span className="text-[10px] text-gray-400">홈</span>
                        </div>
                        <div
                            onClick={() => navigate('/skills')}
                            className="flex flex-col items-center justify-center p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                        >
                            <Zap size={20} className="mb-1 text-green-500" />
                            <span className="text-[10px] text-gray-400">스킬</span>
                        </div>
                        <div
                            onClick={() => navigate('/community')}
                            className="flex flex-col items-center justify-center p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                        >
                            <Users size={20} className="mb-1 text-blue-500" />
                            <span className="text-[10px] text-gray-400">커뮤니티</span>
                        </div>
                        <div
                            onClick={() => navigate('/weapons')}
                            className="flex flex-col items-center justify-center p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                        >
                            <Crosshair size={20} className="mb-1 text-purple-500" />
                            <span className="text-[10px] text-gray-400">무기 정보</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Toggle Button */}
                <button
                    onClick={() => useStore.setState(state => ({ isNavMenuOpen: !state.isNavMenuOpen }))}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${useStore.getState().isNavMenuOpen ? 'bg-arc-accent text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                    {useStore.getState().isNavMenuOpen ? <ChevronDown size={16} /> : <Layers size={16} />}
                    <span className="text-xs font-bold uppercase">Quick Nav</span>
                </button>

                {isAuthenticated ? (
                    <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 flex items-center justify-between group hover:border-gray-700 transition-colors w-full">
                        <div className="flex items-center gap-3 w-full">
                            <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-700">
                                <User size={20} className="text-gray-300" />
                            </div>
                            <div className="flex flex-col opacity-100 flex flex-1 min-w-0">
                                <span className="text-xs text-gray-500 font-bold uppercase mb-1">Operator</span>
                                <div className="flex items-center gap-2">
                                    <LevelBadge level={user.level || 1} size="w-5 h-5" />
                                    <button
                                        onClick={openMyPageModal}
                                        className="text-sm font-bold text-white hover:text-arc-accent text-left transition-colors truncate"
                                    >
                                        {user.nickname || user.username}
                                    </button>
                                </div>
                                <div className="mt-2 w-full pr-2">
                                    <ExperienceBar points={user.points || 0} className="" />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all opacity-100 block"
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
                        <span className="opacity-100 inline">
                            로그인 / 회원가입
                        </span>
                    </button>
                )}


            </div>
        </div>
    );
};

// 아코디언 필터 컴포넌트
const AccordionFilter = ({ mainType, category }) => {
    const { filters, toggleFilter, toggleCategory, markers } = useStore();
    const [isOpen, setIsOpen] = useState(true); // Default open

    // Check if all items in this category are checked
    const typeIds = category.types.map(t => t.id);
    const allChecked = typeIds.every(id => filters[id]);
    const someChecked = typeIds.some(id => filters[id]);

    // Calculate counts
    const categoryMarkers = markers.filter(m => m.type === mainType);
    const totalCount = categoryMarkers.length;

    const getTypeCount = (typeId) => {
        return categoryMarkers.filter(m => m.category === typeId).length;
    };

    // 아이콘 매핑 (카테고리별 대표 아이콘)
    const getCategoryIcon = (type) => {
        switch (type) {
            case 'location': return <MapIcon size={18} className="text-purple-400" />;
            case 'nature': return <Layers size={18} className="text-emerald-400" />;
            case 'container': return <Layers size={18} className="text-orange-400" />; // Box icon replacement
            case 'resource': return <Layers size={18} className="text-blue-400" />;
            case 'weapon': return <Crosshair size={18} className="text-red-400" />;
            case 'quest': return <Shield size={18} className="text-yellow-400" />;
            default: return <Layers size={18} />;
        }
    };

    return (
        <div className="w-full rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden transition-all duration-300 group/accordion">
            {/* 헤더 (카테고리 토글 및 확장) */}
            <div className="flex items-center p-3 cursor-pointer hover:bg-gray-800/50 transition-colors">
                <div
                    className="flex-1 flex items-center gap-3 overflow-hidden"
                    onClick={() => {
                        const el = document.getElementById(`accordion-${mainType}`);
                        if (el) el.classList.toggle('hidden');
                    }}
                >
                    {getCategoryIcon(mainType)}
                    <span className="font-bold text-sm text-gray-300 opacity-100 whitespace-nowrap flex items-center gap-1">
                        {category.label.split('(')[0].trim()}
                        <span className="text-gray-500 font-mono text-sm">({totalCount})</span>
                    </span>
                </div>

                {/* 전체 토글 스위치 */}
                <div className="opacity-100 flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(mainType);
                        }}
                        className={`w-8 h-4 rounded-full p-0.5 transition-colors ${allChecked ? 'bg-arc-accent' : 'bg-gray-700'}`}
                    >
                        <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${allChecked ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            {/* 바디 (하위 항목 리스트) */}
            <div id={`accordion-${mainType}`} className="block border-t border-gray-800/50 bg-black/20">
                {category.types
                    .map(type => ({ ...type, count: getTypeCount(type.id) })) // Add count to object
                    .sort((a, b) => {
                        // Sort by active status (count > 0) first
                        const aActive = a.count > 0;
                        const bActive = b.count > 0;
                        if (aActive && !bActive) return -1;
                        if (!aActive && bActive) return 1;
                        return 0; // Maintain original order for same status
                    })
                    .map((type) => {
                        const count = type.count;
                        const isDisabled = count === 0;

                        return (
                            <div
                                key={type.id}
                                onClick={() => !isDisabled && toggleFilter(type.id)}
                                className={`flex items-center justify-between py-2 px-3 pl-10 transition-colors group/item ${isDisabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-white/5 cursor-pointer'
                                    }`}
                            >
                                <div className="flex items-center gap-2 overflow-hidden flex-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isDisabled ? 'bg-gray-600' : (filters[type.id] ? 'bg-arc-accent' : 'bg-gray-600')
                                        }`} />
                                    <span className={`text-xs transition-colors truncate ${isDisabled ? 'text-gray-500' : (filters[type.id] ? 'text-gray-300' : 'text-gray-600')
                                        }`}>
                                        {type.label.split('(')[0].trim()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 font-mono">{count}</span>

                                    {/* 체크박스 (커스텀 스타일) */}
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isDisabled
                                        ? 'border-gray-700 bg-transparent'
                                        : (filters[type.id] ? 'bg-arc-accent border-arc-accent' : 'border-gray-600 bg-transparent')
                                        }`}>
                                        {!isDisabled && filters[type.id] && <div className="w-2 h-2 bg-white rounded-[1px]" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Sidebar;
