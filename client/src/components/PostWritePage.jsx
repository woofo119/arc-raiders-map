import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PostWritePage = () => {
    const navigate = useNavigate();
    const { createPost } = useStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'align', 'color', 'background'
    ];

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Quill content might be just <p><br></p> if empty
        if (!title.trim() || content.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        const result = await createPost(title, content, images);
        setIsSubmitting(false);

        if (result.success) {
            navigate('/community');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="flex-1 bg-[#0f0f0f] text-white overflow-y-auto h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    돌아가기
                </button>

                <h1 className="text-2xl font-bold mb-6">글쓰기</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 text-lg text-white placeholder-gray-500 focus:border-arc-accent focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden text-black">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            className="h-96 mb-12" // mb-12 for toolbar space
                        />
                    </div>

                    {/* 이미지 업로드 (첨부파일) */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm">
                                <ImageIcon size={16} />
                                이미지/파일 첨부
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-xs text-gray-500">추가 이미지를 첨부할 수 있습니다.</span>
                        </div>

                        {images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <div key={index} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-700 group">
                                        <img src={img} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={() => navigate('/community')}
                            className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-arc-accent hover:bg-orange-600 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? '등록 중...' : '등록하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostWritePage;
