import { useState } from 'react';
import useStore, { MARKER_CATEGORIES } from '../store/useStore';
import { X, MapPin, FileText, Shield } from 'lucide-react';

const MarkerForm = ({ position, onClose }) => {
    const { addMarker, user } = useStore();
    const [mainType, setMainType] = useState('container');
    const [subType, setSubType] = useState(MARKER_CATEGORIES.container.types[0].id);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [isOfficial, setIsOfficial] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalIsOfficial = user?.role === 'admin' && isOfficial;

        await addMarker({
            x: position.x,
            y: position.y,
            type: mainType,
            category: subType,
            title: title || getLabel(mainType, subType),
            description,
            image,
            isOfficial: finalIsOfficial
        });
        onClose();
    };

    const getLabel = (main, sub) => {
        const category = MARKER_CATEGORIES[main];
        const type = category?.types.find(t => t.id === sub);
        return type ? type.label : '';
    };

    return (
        <div className="absolute top-4 right-4 z-[1000] bg-black/90 text-white p-4 rounded-xl border border-gray-700 w-80 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-10">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="font-bold text-lg flex items-center gap-2 text-arc-accent">
                    <MapPin size={18} />
                    새 마커 추가
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 메인 카테고리 선택 */}
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Category</label>
                    <select
                        value={mainType}
                        onChange={(e) => {
                            setMainType(e.target.value);
                            setSubType(MARKER_CATEGORIES[e.target.value].types[0].id);
                        }}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-arc-accent focus:outline-none transition-colors"
                    >
                        {Object.entries(MARKER_CATEGORIES).map(([key, value]) => (
                            <option key={key} value={key}>{value.label}</option>
                        ))}
                    </select>
                </div>

                {/* 상세 타입 선택 */}
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Type</label>
                    <select
                        value={subType}
                        onChange={(e) => setSubType(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-arc-accent focus:outline-none transition-colors"
                    >
                        {MARKER_CATEGORIES[mainType].types.map((type) => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Title</label>
                    <input
                        type="text"
                        placeholder={getLabel(mainType, subType)}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-sm text-white placeholder-gray-600 focus:border-arc-accent focus:outline-none transition-colors"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Description</label>
                    <textarea
                        placeholder="상세 설명을 입력하세요 (선택)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-sm text-white placeholder-gray-600 focus:border-arc-accent focus:outline-none transition-colors resize-none h-20"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                        <FileText size={10} /> Screenshot
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setImage(reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-sm text-gray-400 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-arc-accent file:text-white hover:file:bg-orange-600 transition-colors cursor-pointer"
                        />
                    </div>
                    {image && (
                        <div className="mt-2 relative group">
                            <img src={image} alt="Preview" className="w-full h-24 object-cover rounded-lg border border-gray-700" />
                            <button
                                type="button"
                                onClick={() => setImage('')}
                                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    )}
                </div>

                {/* 관리자 전용 옵션: 공식 마커 여부 */}
                {user && user.role === 'admin' && (
                    <div className="pt-2 border-t border-gray-800">
                        <label className="flex items-center gap-2 text-xs text-yellow-500 cursor-pointer hover:text-yellow-400 font-bold">
                            <input
                                type="checkbox"
                                checked={isOfficial}
                                onChange={(e) => setIsOfficial(e.target.checked)}
                                className="rounded border-gray-700 bg-black/50 text-yellow-500 focus:ring-0"
                            />
                            <Shield size={12} />
                            공식 마커로 등록 (Official)
                        </label>
                    </div>
                )}

                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        className="flex-1 bg-arc-accent hover:bg-orange-600 text-white py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                    >
                        추가하기
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg font-bold text-sm transition-all active:scale-95"
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MarkerForm;
