import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { ArrowLeft, User, Clock, Eye, MoreVertical, Trash2, Edit } from 'lucide-react';

import 'react-quill/dist/quill.snow.css';

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Use selectors to prevent unnecessary re-renders
    const fetchPost = useStore(state => state.fetchPost);
    const currentPost = useStore(state => state.currentPost);
    const user = useStore(state => state.user);
    const deletePost = useStore(state => state.deletePost);
    const addComment = useStore(state => state.addComment);
    const deleteComment = useStore(state => state.deleteComment);
    const clearCurrentPost = useStore(state => state.clearCurrentPost);

    // Local state for comments
    const [commentContent, setCommentContent] = useState('');

    useEffect(() => {
        if (id) {
            clearCurrentPost();
            fetchPost(id);
        }
    }, [id]); // Only re-run if ID changes. fetchPost and clearCurrentPost are stable from Zustand.

    const handleDelete = async () => {
        if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            const result = await deletePost(id);
            if (result.success) {
                navigate('/community');
            } else {
                alert(result.message);
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        const result = await addComment(currentPost._id, commentContent);
        if (result.success) {
            setCommentContent('');
        } else {
            alert(result.message);
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (confirm('댓글을 삭제하시겠습니까?')) {
            const result = await deleteComment(currentPost._id, commentId);
            if (!result.success) {
                alert(result.message);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        } catch (e) {
            return '';
        }
    };

    if (!currentPost) return <div className="flex-1 bg-[#0f0f0f] flex items-center justify-center text-gray-500">로딩 중...</div>;

    const isAuthor = user && currentPost.author && (user._id === currentPost.author._id || user.role === 'admin');

    return (
        <div className="flex-1 bg-[#0f0f0f] text-white overflow-y-auto h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    목록으로
                </button>

                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden mb-8">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-800">
                        <h1 className="text-2xl font-bold mb-4">{currentPost.title}</h1>
                        <div className="flex justify-between items-center text-sm text-gray-400">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 text-gray-300 font-bold">
                                    <User size={14} />
                                    <img
                                        src={`/levels/level_${currentPost.author?.level || 1}.png`}
                                        alt={`Lv.${currentPost.author?.level || 1}`}
                                        className="w-4 h-4 object-contain mx-1"
                                    />
                                    {currentPost.author?.nickname || currentPost.author?.username || '익명'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {formatDate(currentPost.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye size={14} />
                                    {currentPost.views}
                                </span>
                            </div>
                            {isAuthor && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/community/edit/${id}`)}
                                        className="text-gray-400 hover:text-blue-400 p-1 transition-colors"
                                        title="수정"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="text-gray-400 hover:text-red-400 p-1 transition-colors"
                                        title="삭제"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 min-h-[300px]">
                        <div className="ql-snow">
                            <div
                                className="ql-editor !p-0 !text-gray-200"
                                dangerouslySetInnerHTML={{ __html: currentPost.content || '' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Comments */}
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        댓글 <span className="text-arc-accent">{currentPost.comments?.length || 0}</span>
                    </h3>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-8 flex gap-4">
                        <input
                            type="text"
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder={user ? "댓글을 입력하세요..." : "로그인이 필요합니다."}
                            disabled={!user}
                            className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-arc-accent focus:outline-none transition-colors disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!user || !commentContent.trim()}
                            className="bg-arc-accent hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            등록
                        </button>
                    </form>

                    {/* Comment List */}
                    <div className="space-y-6">
                        {currentPost.comments && currentPost.comments.length > 0 ? (
                            currentPost.comments.map((comment) => (
                                <div key={comment._id} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-300 flex items-center gap-1">
                                                <img
                                                    src={`/levels/level_${comment.author?.level || 1}.png`}
                                                    alt={`Lv.${comment.author?.level || 1}`}
                                                    className="w-3 h-3 object-contain"
                                                />
                                                {comment.author?.nickname || comment.author?.username || '익명'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        {(user && (user._id === comment.author?._id || user.role === 'admin')) && (
                                            <button
                                                onClick={() => handleCommentDelete(comment._id)}
                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-4">
                                첫 번째 댓글을 남겨보세요!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
