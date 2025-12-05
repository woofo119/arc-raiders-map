import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Search, Filter } from 'lucide-react';
import useStore from '../store/useStore';
import WeaponUploadModal from './WeaponUploadModal';

const GRADE_COLORS = {
    Common: '#666871',
    Uncommon: '#35c15c',
    Rare: '#009bf4',
    Epic: '#d74798',
    Legendary: '#ffbf00'
};

const WeaponDBPage = () => {
    const navigate = useNavigate();
    const { weapons, fetchWeapons, deleteWeapon, user } = useStore();
    const [selectedTab, setSelectedTab] = useState('Main'); // Main, Side, All
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWeapons().catch(err => console.error("Failed to fetch weapons:", err));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('정말로 이 무기를 삭제하시겠습니까?')) {
            await deleteWeapon(id);
        }
    };

    console.log('Current weapons state:', weapons);

    // Safeguard: Ensure weapons is an array
    const safeWeapons = Array.isArray(weapons) ? weapons : [];

    const filteredWeapons = safeWeapons.filter(weapon => {
        if (!weapon) return false;
        const matchesTab = selectedTab === 'All' || weapon.type === selectedTab;
        const matchesSearch = weapon.name ? weapon.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        return matchesTab && matchesSearch;
    });

    return (
        <div className="flex-1 bg-black text-white flex flex-col overflow-hidden min-h-0">
            {/* Header */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-sm z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-yellow-500 tracking-wider">WEAPON INFO</h1>

                    {/* Tabs */}
                    <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700 ml-8">
                        {['Main', 'Side', 'All'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedTab === tab
                                    ? 'bg-gray-700 text-white shadow-md'
                                    : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                {tab === 'All' ? '전체' : tab === 'Main' ? '주무기' : '보조무기'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="아이템 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black border border-gray-700 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:border-yellow-500 w-64 transition-colors"
                        />
                    </div>

                    {user && user.role === 'admin' && (
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-all text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                        >
                            <Plus size={16} />
                            <span>아이템 추가</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
                    {filteredWeapons.map(weapon => (
                        <div
                            key={weapon._id}
                            className="relative group cursor-pointer"
                            onClick={() => navigate(`/weapons/${weapon._id}`)}
                        >
                            {/* Outer Wrapper with Grade Color Border Effect */}
                            <div
                                style={{
                                    background: GRADE_COLORS[weapon.grade || 'Common'],
                                    padding: '1px',
                                    borderRadius: '5px'
                                }}
                                className="relative transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                            >
                                {/* Inner Card Content */}
                                <div
                                    style={{
                                        background: 'radial-gradient(at top right, #0c0f1b 50%, #0c0f1ba0)',
                                        borderRadius: '4px 4px 4px 50px',
                                        overflow: 'hidden'
                                    }}
                                    className="relative h-full flex flex-col"
                                >
                                    {/* Image Area */}
                                    <div className="aspect-[4/3] relative flex items-center justify-center p-4">
                                        {weapon.imageUrl ? (
                                            <img src={weapon.imageUrl} alt={weapon.name} className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
                                        ) : (
                                            <div className="text-gray-600 text-xs text-center p-4">No Image</div>
                                        )}

                                        {/* Grade Label */}
                                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] bg-black/60 text-white font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
                                            {weapon.grade || 'Common'}
                                        </div>
                                    </div>

                                    {/* Text Info */}
                                    <div className="p-3 pt-0 flex-1 flex flex-col justify-end">
                                        <h3 className="text-sm font-bold text-white leading-tight mb-1 truncate">{weapon.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wide">{weapon.type}</p>

                                        {/* Admin Delete Button (Invisible until hover) */}
                                        {user && user.role === 'admin' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(weapon._id);
                                                }}
                                                className="absolute bottom-2 right-2 p-1.5 bg-red-900/80 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredWeapons.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                        <Search size={48} className="mb-4" />
                        <p>등록된 아이템이 없습니다.</p>
                    </div>
                )}
            </div>

            {isUploadModalOpen && <WeaponUploadModal onClose={() => setIsUploadModalOpen(false)} />}
        </div>
    );
};

export default WeaponDBPage;
