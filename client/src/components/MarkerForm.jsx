import { useState } from 'react';
import useStore from '../store/useStore';
import { MapPin, Type, FileText } from 'lucide-react';

const MarkerForm = ({ position, onClose }) => {
    const [type, setType] = useState('resource');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const { addMarker } = useStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await addMarker({
            x: position.x,
            y: position.y,
            type,
            title,
            description,
            image
        });

        if (result.success) {
            onClose();
        } else {
            alert(result.message);
        }
    };

    return (
        <div
            className="absolute z-[1000] bg-[#1a1a1a]/95 backdrop-blur-md border border-gray-700 p-5 rounded-xl shadow-2xl w-72 animate-in zoom-in-95 duration-200"
            style={{ left: position.containerPoint.x, top: position.containerPoint.y }}
        >
            <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                <MapPin className="text-arc-accent" size={16} />
                <h3 className="text-white font-bold text-sm">새 마커 추가</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                        <Type size={10} /> Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-arc-accent focus:outline-none transition-colors"
                    >
                        <option value="resource">📦 자원 (Resource)</option>
                        <option value="weapon">🔫 무기 (Weapon)</option>
                        <option value="quest">📜 퀘스트 (Quest)</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                        <Type size={10} /> Name
                    </label>
                    <input
                        type="text"
                        placeholder="아이템 또는 장소 이름"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-sm text-white placeholder-gray-600 focus:border-arc-accent focus:outline-none transition-colors"
                        required
                        autoFocus
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">
                        <FileText size={10} /> Description
                    </label>
                    <textarea
                        placeholder="상세 설명을 입력하세요 (선택)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-sm text-white placeholder-gray-600 h-20 resize-none focus:border-arc-accent focus:outline-none transition-colors"
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        className="flex-1 bg-arc-accent hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-lg shadow-arc-accent/20"
                    >
                        추가하기
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MarkerForm;
