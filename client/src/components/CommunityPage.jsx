import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Search, PenTool, MessageSquare, Eye, Clock, User, ArrowLeft } from 'lucide-react';

const CommunityPage = () => {
    const navigate = useNavigate();
    const { posts, fetchPosts, user, isAuthenticated, openLoginModal } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleWriteClick = () => {
        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            openLoginModal();
            return;
        }
        navigate('/community/write');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    return (
        <div className="flex-1 bg-[#0f0f0f] text-white overflow-y-auto h-screen p-8">
            <div className="max-w-5xl mx-auto">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <button
                                onClick={() => navigate('/')}
                                className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-lg transition-colors"
                                title="홈으로"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-3xl font-bold text-white">커뮤니티</h1>
                        </div>
                        <p className="text-gray-400 pl-14">ARC Raiders 유저들과 정보를 공유하세요.</p>
                    </div>
                    <button
                        onClick={handleWriteClick}
                        className="bg-arc-accent hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-orange-900/20"
                    >
                        <PenTool size={18} />
                        글쓰기
                    </button>
                </div>

                {/* 검색 및 필터 */}
                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-6 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="제목, 작성자 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-arc-accent focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* 게시글 목록 */}
                <div className="space-y-2">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            게시글이 없습니다. 첫 번째 글을 작성해보세요!
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <div
                                key={post._id}
                                onClick={() => navigate(`/community/${post._id}`)}
                                className="bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-gray-700 p-4 rounded-xl cursor-pointer transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-gray-200 group-hover:text-arc-accent transition-colors line-clamp-1">
                                                {post.title}
                                            </h3>
                                            {post.images && post.images.length > 0 && (
                                                <span className="bg-gray-800 text-gray-400 text-[10px] px-1.5 py-0.5 rounded border border-gray-700">IMG</span>
                                            )}
                                            {post.views > 100 && (
                                                <span className="bg-red-900/30 text-red-400 text-[10px] px-1.5 py-0.5 rounded border border-red-900/50">HOT</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <User size={12} />
                                                {post.author?.nickname || post.author?.username || '익명'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {formatDate(post.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={12} />
                                                {post.views}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 썸네일 (이미지가 있는 경우) */}
                                    {post.images && post.images.length > 0 && (
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-700 ml-4 flex-shrink-0">
                                            <img src={post.images[0]} alt="Thumbnail" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
