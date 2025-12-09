import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { ArrowLeft, User, Clock, Eye, MoreVertical, Trash2, Edit, MessageSquare, Heart, CornerDownRight } from 'lucide-react';
import LevelBadge from './LevelBadge';
import { calculateLevelInfo } from '../utils/levelLogic';

import 'react-quill/dist/quill.snow.css';

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchPost = useStore(state => state.fetchPost);
    const currentPost = useStore(state => state.currentPost);
    const user = useStore(state => state.user);
    const deletePost = useStore(state => state.deletePost);
    const addComment = useStore(state => state.addComment);
    const deleteComment = useStore(state => state.deleteComment);
    const toggleLike = useStore(state => state.toggleLike);
    const clearCurrentPost = useStore(state => state.clearCurrentPost);

    const [commentContent, setCommentContent] = useState('');
    const [replyContent, setReplyContent] = useState({}); // Key: parentId
    const [activeReplyId, setActiveReplyId] = useState(null); // ID of comment being replied to

    useEffect(() => {
        if (id) {
            clearCurrentPost();
            fetchPost(id);
        }
    }, [id]);

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

        const result = await addComment(currentPost._id, commentContent, null);
        if (result.success) {
            setCommentContent('');
        } else {
            alert(result.message);
        }
    };

    const handleReplySubmit = async (parentId) => {
        const content = replyContent[parentId];
        if (!content?.trim()) return;

        const result = await addComment(currentPost._id, content, parentId);
        if (result.success) {
            setReplyContent({ ...replyContent, [parentId]: '' });
            setActiveReplyId(null);
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

    const handleLike = async (target, commentId = null) => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }
        await toggleLike(currentPost._id, target, commentId);
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

    // Initial Filter: Only show root comments (parentId is null or missing)
    const rootComments = currentPost.comments?.filter(c => !c.parentId) || [];

    const handleReplyChange = (commentId, value) => {
        setReplyContent(prev => ({ ...prev, [commentId]: value }));
    };

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
                                    <LevelBadge level={calculateLevelInfo(currentPost.author?.points || 0).level} size="w-5 h-5" className="mx-1" />
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

                {/* Post Like Button */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => handleLike('post')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${user && currentPost.likes?.includes(user._id)
                            ? 'bg-arc-accent text-white shadow-[0_0_15px_rgba(255,100,0,0.5)]'
                            : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                            }`}
                    >
                        <Heart size={24} className={user && currentPost.likes?.includes(user._id) ? "fill-white" : ""} />
                        <span className="font-bold">{currentPost.likes?.length || 0}</span>
                        <span className="text-sm">추천</span>
                    </button>
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
                    <div className="space-y-2">
                        {rootComments.length > 0 ? (
                            rootComments.map((comment) => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    activeReplyId={activeReplyId}
                                    setActiveReplyId={setActiveReplyId}
                                    replyContent={replyContent}
                                    onReplyChange={handleReplyChange}
                                    onReplySubmit={handleReplySubmit}
                                    onLike={handleLike}
                                    onDelete={handleCommentDelete}
                                    user={user}
                                    allComments={currentPost.comments}
                                    formatDate={formatDate}
                                />
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

// Extracted CommentItem Component
const CommentItem = ({
    comment,
    depth = 0,
    activeReplyId,
    setActiveReplyId,
    replyContent,
    onReplyChange,
    onReplySubmit,
    onLike,
    onDelete,
    user,
    allComments,
    formatDate
}) => {
    const isReplying = activeReplyId === comment._id;
    const replies = allComments.filter(c => c.parentId === comment._id);

    return (
        <div className={`border-b border-gray-800 last:border-0 ${depth > 0 ? 'ml-8 border-l-2 border-l-gray-800 pl-4' : ''}`}>
            <div className="py-6">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-300 flex items-center gap-1">
                            <LevelBadge level={calculateLevelInfo(comment.author?.points || 0).level} size="w-5 h-5" />
                            <span className="ml-1">
                                {comment.author?.nickname || comment.author?.username || '익명'}
                            </span>
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Comment Like Button */}
                        <button
                            onClick={() => onLike('comment', comment._id)}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors ${comment.likes?.includes(user?._id) ? 'text-arc-accent' : 'text-gray-500'}`}
                        >
                            <Heart size={14} fill={comment.likes?.includes(user?._id) ? "currentColor" : "none"} />
                            <span>{comment.likes?.length || 0}</span>
                        </button>

                        {/* Reply Toggle */}
                        <button
                            onClick={() => setActiveReplyId(isReplying ? null : comment._id)}
                            className="text-gray-500 hover:text-blue-400 transition-colors text-xs flex items-center gap-1"
                        >
                            <MessageSquare size={14} />
                            답글
                        </button>

                        {(user && (user._id === comment.author?._id || user.role === 'admin')) && (
                            <button
                                onClick={() => onDelete(comment._id)}
                                className="text-gray-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {comment.content}
                </p>

                {/* Reply Form */}
                {isReplying && (
                    <div className="mt-4 mb-4 flex gap-2 pl-4 border-l-2 border-arc-accent">
                        <input
                            type="text"
                            value={replyContent[comment._id] || ''}
                            onChange={(e) => onReplyChange(comment._id, e.target.value)}
                            placeholder="답글을 입력하세요..."
                            className="flex-1 bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-arc-accent focus:outline-none"
                            autoFocus
                        />
                        <button
                            onClick={() => onReplySubmit(comment._id)}
                            className="bg-arc-accent hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                        >
                            등록
                        </button>
                    </div>
                )}
            </div>

            {/* Render Replies */}
            {replies.length > 0 && (
                <div className="mt-2">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            depth={depth + 1}
                            activeReplyId={activeReplyId}
                            setActiveReplyId={setActiveReplyId}
                            replyContent={replyContent}
                            onReplyChange={onReplyChange}
                            onReplySubmit={onReplySubmit}
                            onLike={onLike}
                            onDelete={onDelete}
                            user={user}
                            allComments={allComments}
                            formatDate={formatDate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostDetailPage;
