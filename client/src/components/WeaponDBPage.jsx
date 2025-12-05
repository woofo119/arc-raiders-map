import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Search, Filter } from 'lucide-react';
import useStore from '../store/useStore';
import WeaponUploadModal from './WeaponUploadModal';

const WeaponDBPage = () => {
    const { weapons, fetchWeapons, deleteWeapon, user } = useStore();
    const [selectedTab, setSelectedTab] = useState('Main'); // Main, Side, All
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWeapons();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('정말로 이 무기를 삭제하시겠습니까?')) {
            await deleteWeapon(id);
        }
    };

    const filteredWeapons = weapons.filter(weapon => {
        const matchesTab = selectedTab === 'All' || weapon.type === selectedTab;
        const matchesSearch = weapon.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="flex-1 bg-black text-white flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-sm z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-yellow-500 tracking-wider">WEAPON DATABASE</h1>

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
                            placeholder="무기 검색..."
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
                            <span>무기 추가</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {filteredWeapons.map(weapon => (
                        <div key={weapon._id} className="group relative bg-[#151515] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                            {/* Image Area */}
                            <div className="aspect-[16/9] bg-[#0a0a0a] relative flex items-center justify-center p-4 border-b border-gray-800 group-hover:bg-[#111] transition-colors">
                                {weapon.imageUrl ? (
                                    <img src={weapon.imageUrl} alt={weapon.name} className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                                ) : (
                                    <div className="text-gray-600 text-sm">No Image</div>
                                )}

                                {/* Identifier Tag */}
                                <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${weapon.type === 'Main' ? 'bg-yellow-900/30 text-yellow-500 border-yellow-800/50' :
                                        weapon.type === 'Side' ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' :
                                            'bg-gray-800 text-gray-400 border-gray-700'
                                    }`}>
                                    {weapon.type}
                                </div>

                                {user && user.role === 'admin' && (
                                    <button
                                        onClick={() => handleDelete(weapon._id)}
                                        className="absolute top-3 right-3 p-1.5 bg-red-900/50 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Info Area */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">{weapon.name}</h3>
                                <div className="w-8 h-0.5 bg-gray-800 mb-3 group-hover:bg-yellow-600 transition-colors"></div>

                                <div className="space-y-2 text-sm text-gray-400">
                                    {weapon.stats && Object.entries(weapon.stats).slice(0, 3).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center border-b border-gray-800/50 pb-1 last:border-0 text-xs">
                                            <span>{key}</span>
                                            <span className="text-gray-200 font-mono">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {weapon.description && (
                                    <p className="mt-3 text-xs text-gray-500 line-clamp-2 border-t border-gray-800 pt-3">
                                        {weapon.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredWeapons.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                        <Search size={48} className="mb-4" />
                        <p>등록된 무기가 없습니다.</p>
                    </div>
                )}
            </div>

            {isUploadModalOpen && <WeaponUploadModal onClose={() => setIsUploadModalOpen(false)} />}
        </div>
    );
};

export default WeaponDBPage;
