import { useState } from 'react';
import useStore from '../store/useStore';
import { MAPS, MARKER_CATEGORIES } from '../constants';
import { Map as MapIcon, Filter as FilterIcon, LogOut, User, Layers, Shield, Crosshair, ChevronDown } from 'lucide-react';

const Sidebar = () => {
    const { user, isAuthenticated, logout, filters, toggleFilter, currentMap, setMap, openLoginModal, openMyPageModal } = useStore();

    return (
        <div className="w-72 bg-[#121212] border-r border-gray-800 flex flex-col h-full shadow-2xl z-[1000] transition-all duration-300 ease-in-out overflow-hidden">
            {/* 헤더 영역 */}
            <div className="py-6 px-6 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-[#121212] flex flex-col items-center overflow-hidden whitespace-nowrap">
                <div className="mb-6 flex justify-center w-full h-12 items-center">
                    <img src="/logo.png" alt="ARC Raiders" className="h-12 object-contain" />
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

                {/* 안내 메시지 */}
                <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800 opacity-100 block">
                    <h4 className="text-white text-sm font-bold mb-2">💡 사용 팁</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        지도에서 원하는 위치를 <span className="text-arc-accent font-bold">우클릭</span>하여<br />
                        새로운 마커를 추가할 수 있습니다.
                    </p>
                </div>
            </div>

            {/* 사용자 프로필 영역 */}
            <div className="py-4 px-4 border-t border-gray-800 bg-[#0f0f0f] overflow-hidden whitespace-nowrap">
                {isAuthenticated ? (
                    <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 flex items-center justify-between group hover:border-gray-700 transition-colors w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-700">
                                <User size={20} className="text-gray-300" />
                            </div>
                            <div className="flex flex-col opacity-100 flex">
                                <span className="text-xs text-gray-500 font-bold uppercase">Operator</span>
                                <button
                                    onClick={openMyPageModal}
                                    className="text-sm font-bold text-white hover:text-arc-accent text-left transition-colors"
                                >
                                    {user.nickname || user.username}
                                </button>
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
    const { filters, toggleFilter, toggleCategory } = useStore();
    const [isOpen, setIsOpen] = useState(true); // Default open

    // Check if all items in this category are checked
    const typeIds = category.types.map(t => t.id);
    const allChecked = typeIds.every(id => filters[id]);
    const someChecked = typeIds.some(id => filters[id]);
    const activeCount = typeIds.filter(id => filters[id]).length;

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
                    <span className="font-bold text-sm text-gray-300 opacity-100 whitespace-nowrap">
                        {category.label.split('(')[0].trim()}
                    </span>
                </div>

                {/* 전체 토글 스위치 */}
                <div className="opacity-100 flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono">{activeCount} items</span>
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
                {category.types.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => toggleFilter(type.id)}
                        className="flex items-center justify-between py-2 px-3 pl-10 hover:bg-white/5 cursor-pointer transition-colors group/item"
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className={`w-1.5 h-1.5 rounded-full ${filters[type.id] ? 'bg-arc-accent' : 'bg-gray-600'}`} />
                            <span className={`text-xs transition-colors truncate ${filters[type.id] ? 'text-gray-300' : 'text-gray-600'}`}>
                                {type.label.split('(')[0].trim()}
                            </span>
                        </div>

                        {/* 체크박스 (커스텀 스타일) */}
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters[type.id] ? 'bg-arc-accent border-arc-accent' : 'border-gray-600 bg-transparent'}`}>
                            {filters[type.id] && <div className="w-2 h-2 bg-white rounded-[1px]" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
