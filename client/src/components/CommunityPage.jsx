import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useStore from '../store/useStore';
import { Search, PenTool, MessageSquare, Eye, Clock, User, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { getRankIcon } from '../utils/rankUtils';

const CommunityPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentCategory = searchParams.get('category');
    const { posts, fetchPosts, user, isAuthenticated, openLoginModal } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const categoryNames = {
        free: '자유',
        quest: '퀘스트',
        tips: '공략/팁',
        qna: '질문'
    };

    const categoryColors = {
        free: 'bg-gray-700 text-gray-200',
        quest: 'bg-blue-900/50 text-blue-300 border-blue-800',
        tips: 'bg-green-900/50 text-green-300 border-green-800',
        qna: 'bg-purple-900/50 text-purple-300 border-purple-800'
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author?.nickname?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = currentCategory ? post.category === currentCategory : true;

        return matchesSearch && matchesCategory;
    });

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
        <div className="flex-1 bg-[#0f0f0f] text-white overflow-y-auto h-screen p-4 md:p-8 pt-16 md:pt-8">
            <div className="max-w-5xl mx-auto">
                {/* 헤더 */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {currentCategory ? categoryNames[currentCategory] : '전체 게시판'}
                            </h1>
                        </div>
                        <p className="text-gray-400 text-sm md:text-base pl-0 md:pl-1">
                            {currentCategory
                                ? `${categoryNames[currentCategory]} 관련 이야기를 나누어보세요.`
                                : 'ARC Raiders 유저들과 정보를 공유하세요.'}
                        </p>
                    </div>
                    <button
                        onClick={handleWriteClick}
                        className="w-full md:w-auto bg-arc-accent hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-900/20"
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

                {/* 게시글 목록 (데스크톱: 테이블) */}
                <div className="hidden md:block bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/50 text-gray-400 text-sm border-b border-gray-700">
                                <th className="p-4 w-16 text-center font-medium">번호</th>
                                <th className="p-4 w-24 text-center font-medium">분류</th>
                                <th className="p-4 font-medium">제목</th>
                                <th className="p-4 w-32 text-center font-medium">글쓴이</th>
                                <th className="p-4 w-24 text-center font-medium">등록일</th>
                                <th className="p-4 w-20 text-center font-medium">조회</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        게시글이 없습니다. 첫 번째 글을 작성해보세요!
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map((post, index) => (
                                    <tr
                                        key={post._id}
                                        onClick={() => navigate(`/community/${post._id}`)}
                                        className="border-b border-gray-800 hover:bg-white/5 cursor-pointer transition-colors group"
                                    >
                                        <td className="p-4 text-center text-gray-500 text-sm">
                                            {filteredPosts.length - index}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-xs px-2 py-1 rounded border ${categoryColors[post.category || 'free']}`}>
                                                {categoryNames[post.category || 'free']}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-200 group-hover:text-arc-accent transition-colors">
                                                    {post.title}
                                                </span>
                                                {post.images && post.images.length > 0 && (
                                                    <span className="text-gray-500" title="이미지 포함">
                                                        <ImageIcon size={14} />
                                                    </span>
                                                )}
                                                {post.views > 100 && (
                                                    <span className="bg-red-900/30 text-red-400 text-[10px] px-1.5 py-0.5 rounded border border-red-900/50">HOT</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-gray-400 text-sm">
                                            <div className="flex items-center justify-center gap-1">
                                                <img
                                                    src={getRankIcon(post.author?.level || 1)}
                                                    alt={`Lv.${post.author?.level || 1}`}
                                                    className="w-4 h-4 object-contain"
                                                />
                                                {post.author?.nickname || post.author?.username || '익명'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-gray-500 text-sm">
                                            {formatDate(post.createdAt)}
                                        </td>
                                        <td className="p-4 text-center text-gray-500 text-sm">
                                            <div className="flex items-center justify-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm">👍</span>
                                                    <span>{post.likes?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye size={14} />
                                                    <span>{post.views}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 게시글 목록 (모바일: 카드 리스트) */}
                <div className="md:hidden space-y-3">
                    {filteredPosts.length === 0 ? (
                        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8 text-center text-gray-500">
                            게시글이 없습니다. 첫 번째 글을 작성해보세요!
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <div
                                key={post._id}
                                onClick={() => navigate(`/community/${post._id}`)}
                                className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 active:bg-gray-800 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 mr-2">
                                        <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded border mb-1 ${categoryColors[post.category || 'free']}`}>
                                            {categoryNames[post.category || 'free']}
                                        </span>
                                        <h3 className="text-white font-bold text-lg line-clamp-2">
                                            {post.title}
                                        </h3>
                                    </div>
                                    {post.images && post.images.length > 0 && (
                                        <ImageIcon size={16} className="text-gray-500 mt-1 flex-shrink-0" />
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <img
                                                src={getRankIcon(post.author?.level || 1)}
                                                alt={`Lv.${post.author?.level || 1}`}
                                                className="w-3 h-3 object-contain"
                                            />
                                            <span className="text-gray-400">
                                                {post.author?.nickname || post.author?.username || '익명'}
                                            </span>
                                        </div>
                                        <span>•</span>
                                        <span>{formatDate(post.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs">👍</span>
                                            <span>{post.likes?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye size={12} />
                                            <span>{post.views}</span>
                                        </div>
                                    </div>
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
