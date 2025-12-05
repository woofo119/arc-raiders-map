import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import useStore from '../store/useStore';

const WeaponUploadModal = ({ onClose }) => {
    const { createWeapon } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Main', // Main, Side, Melee, Grenade
        description: '',
        stats: {}
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [statInput, setStatInput] = useState({ key: '', value: '' });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddStat = () => {
        if (statInput.key && statInput.value) {
            setFormData(prev => ({
                ...prev,
                stats: { ...prev.stats, [statInput.key]: statInput.value }
            }));
            setStatInput({ key: '', value: '' });
        }
    };

    const handleRemoveStat = (key) => {
        setFormData(prev => {
            const newStats = { ...prev.stats };
            delete newStats[key];
            return { ...prev, stats: newStats };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            imageUrl: imagePreview
        };

        const result = await createWeapon(payload);
        if (result.success) {
            alert('무기가 등록되었습니다.');
            onClose();
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#222]">
                    <h2 className="text-lg font-bold text-white">무기 등록</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center justify-center">
                        <label className="relative w-full h-48 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-800/50 transition-all overflow-hidden group">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <>
                                    <Upload size={32} className="text-gray-500 mb-2 group-hover:text-gray-300" />
                                    <span className="text-sm text-gray-500 group-hover:text-gray-300">이미지 업로드</span>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">무기 이름</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                placeholder="예: AKM"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">종류</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                            >
                                <option value="Main">주무기 (Main)</option>
                                <option value="Side">보조무기 (Side)</option>
                                <option value="Melee">근접무기 (Melee)</option>
                                <option value="Grenade">투척무기 (Grenade)</option>
                                <option value="Gadget">가젯 (Gadget)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">설명</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors h-24 resize-none"
                                placeholder="무기 설명을 입력하세요..."
                            />
                        </div>

                        {/* Stats Builder */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2">스탯 정보</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="스탯 이름 (예: Damage)"
                                    value={statInput.key}
                                    onChange={(e) => setStatInput({ ...statInput, key: e.target.value })}
                                    className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-yellow-500"
                                />
                                <input
                                    type="text"
                                    placeholder="값 (예: 25)"
                                    value={statInput.value}
                                    onChange={(e) => setStatInput({ ...statInput, value: e.target.value })}
                                    className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-yellow-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddStat}
                                    className="px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* Stats List */}
                            <div className="space-y-2">
                                {Object.entries(formData.stats).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                                        <span className="text-sm text-gray-300">{key}: <span className="font-bold text-white">{value}</span></span>
                                        <button onClick={() => handleRemoveStat(key)} className="text-red-500 hover:text-red-400">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-[#222] flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.name}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WeaponUploadModal;
