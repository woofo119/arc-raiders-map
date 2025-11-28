import { useState } from 'react';
import useStore from '../store/useStore';
import { MAPS, MARKER_CATEGORIES } from '../constants';
import { Map, Filter, LogOut, User, ChevronDown, Box, MapPin, Leaf, Shield, ChevronRight } from 'lucide-react';

const Sidebar = () => {
    const { user, isAuthenticated, logout, filters, toggleFilter, currentMap, setMap, openLoginModal, openMyPageModal, markers } = useStore();
    const [expandedCategories, setExpandedCategories] = useState({
        location: true,
        nature: true,
        container: true,
        quest: true
    });

    const toggleCategory = (cat) => {
        setExpandedCategories(prev => ({
            ...prev,
            [cat]: !prev[cat]
        }));
    };

    // 카테고리별 아이콘 매핑
    const categoryIcons = {
        container: <Box size={20} className="text-orange-400" />,
        location: <MapPin size={20} className="text-purple-400" />,
        nature: <Leaf size={20} className="text-green-400" />,
        quest: <Shield size={20} className="text-blue-400" />
    };

    const categoryColors = {
        container: 'orange',
        location: 'purple',
        nature: 'green',
        quest: 'blue'
    };

    // 마커 개수 계산
    const getCount = (type, category) => {
        if (category) {
            return markers.filter(m => m.category === category).length;
        }
        return markers.filter(m => m.type === type).length;
    };

    return (
        <div className="w-20 hover:w-72 bg-[#121212] border-r border-gray-800 flex flex-col h-full shadow-2xl z-[1000] transition-all duration-300 ease-in-out group/sidebar overflow-hidden">
            {/* 헤더 영역 */}
            <div className="py-6 px-2 group-hover:px-6 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-[#121212] flex flex-col items-center overflow-hidden whitespace-nowrap transition-all duration-300">
                <div className="mb-6 flex justify-center w-full h-12 items-center">
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
                <div className="block group-hover/sidebar:hidden text-gray-400 mt-2">
                    <Map size={24} />
                </div>
            </div>

            {/* 필터 영역 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-2 group-hover:px-6 transition-all duration-300 scrollbar-hide">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-center group-hover/sidebar:justify-start gap-2 whitespace-nowrap h-6">
                    <Filter size={16} className="min-w-[16px]" />
                    <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100 hidden group-hover/sidebar:inline">
                        Filter Categories
                    </span>
                </h3>

                <div className="space-y-2 flex flex-col items-center group-hover/sidebar:items-stretch">
                    {Object.entries(MARKER_CATEGORIES).map(([key, category]) => (
                        <div key={key} className="w-full">
                            {/* 메인 카테고리 */}
                            <div className="flex items-center w-full">
                                <FilterItem
                                    label={category.label}
                                    icon={categoryIcons[key]}
                                    checked={filters[key]}
                                    onChange={() => toggleFilter(key)}
                                    color={categoryColors[key]}
                                    count={getCount(key)}
                                    isExpanded={expandedCategories[key]}
                                    onExpand={() => toggleCategory(key)}
                                    hasChildren={true}
                                />
                            </div>

                            {/* 하위 아이템 (아코디언) */}
                            <div className={`
                                overflow-hidden transition-all duration-300 ease-in-out
                                ${expandedCategories[key] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                                hidden group-hover/sidebar:block
                            `}>
                                <div className="ml-4 mt-1 space-y-1 border-l border-gray-800 pl-2">
                                    {category.types.map((type) => (
                                        <label key={type.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer group/item transition-colors">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className={`w-1.5 h-1.5 rounded-full ${filters[type.id] ? `bg-${categoryColors[key]}-500` : 'bg-gray-600'}`} />
                                                <span className={`text-xs truncate ${filters[type.id] ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    {type.label.split('(')[0].trim()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-gray-600">{getCount(null, type.id)}</span>
                                                <input
                                                    type="checkbox"
                                                    checked={filters[type.id] || false}
                                                    onChange={() => toggleFilter(type.id)}
                                                    className="w-3 h-3 rounded border-gray-600 bg-gray-700 text-arc-accent focus:ring-0 focus:ring-offset-0"
                                                />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
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
            <div className="py-4 px-2 group-hover:px-4 border-t border-gray-800 bg-[#0f0f0f] overflow-hidden whitespace-nowrap transition-all duration-300">
                {isAuthenticated ? (
                    <div className="bg-gray-900 rounded-xl p-2 group-hover/sidebar:p-3 border border-gray-800 flex items-center justify-center group-hover/sidebar:justify-between group hover:border-gray-700 transition-colors w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-700">
                                <User size={20} className="text-gray-300" />
                            </div>
                            <div className="flex flex-col opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75 hidden group-hover/sidebar:flex">
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
                            className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover/sidebar:opacity-100 hidden group-hover/sidebar:block"
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
                        <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap hidden group-hover/sidebar:inline">
                            로그인 / 회원가입
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

// 필터 아이템 컴포넌트 (수정됨)
const FilterItem = ({ label, icon, checked, onChange, color, count, isExpanded, onExpand, hasChildren }) => (
    <div className={`flex items-center p-2 rounded-xl transition-all duration-300 border overflow-hidden whitespace-nowrap w-full group/filter
    ${checked
            ? `bg-gray-900 border-${color}-500/30 shadow-lg shadow-${color}-900/10`
            : 'bg-transparent border-transparent hover:bg-gray-900 hover:border-gray-800'
        }`}>

        {/* 아이콘 영역 (클릭 시 토글) */}
        <div
            className="min-w-[20px] flex items-center justify-center cursor-pointer"
            onClick={onChange}
        >
            {icon}
        </div>

        {/* 라벨 및 컨트롤 영역 */}
        <div className="flex items-center justify-between flex-1 ml-3 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100 hidden group-hover/sidebar:flex">
            <div className="flex flex-col cursor-pointer flex-1" onClick={onExpand}>
                <span className={`text-sm font-medium truncate ${checked ? 'text-white' : 'text-gray-500'}`}>
                    {label.split('(')[0].trim()}
                </span>
                <span className="text-[10px] text-gray-600">
                    {count} items
                </span>
            </div>

            <div className="flex items-center gap-2">
                {/* 확장/축소 버튼 */}
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onExpand();
                        }}
                        className="text-gray-500 hover:text-white transition-colors"
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                )}

                {/* 체크박스 */}
                <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer
                    ${checked ? `bg-${color}-500 border-${color}-500` : 'border-gray-700 bg-gray-800'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange();
                    }}
                >
                    {checked && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
            </div>
        </div>
    </div>
);

export default Sidebar;
