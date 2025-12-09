import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Bell, Check, MessageSquare, Trash2 } from 'lucide-react';

const NotificationDropdown = () => {
    const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead, deleteAllNotifications, fetchNotifications } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch on mount (already done in checkAuth, but safe to do again)
    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await markNotificationAsRead(notification._id);
        }
        setIsOpen(false);
        navigate(`/community/${notification.post._id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        return `${days}일 전`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-[#0f0f0f]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed top-20 right-4 left-4 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-96 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Bell size={14} className="text-arc-accent" />
                            알림
                        </h3>
                        <div className="flex items-center gap-2">
                            {notifications.length > 0 && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('모든 알림을 삭제하시겠습니까?')) {
                                            deleteAllNotifications();
                                        }
                                    }}
                                    className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors mr-2"
                                    title="모두 삭제"
                                >
                                    <Trash2 size={12} />
                                    삭제
                                </button>
                            )}
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllNotificationsAsRead}
                                    className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    <Check size={12} />
                                    읽음
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                새로운 알림이 없습니다.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-800/50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${!notification.isRead ? 'bg-arc-accent/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'like' ? 'bg-pink-500/20 text-pink-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                    <MessageSquare size={14} />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-300">
                                                    <span className="font-bold text-white">{notification.sender?.nickname}</span>
                                                    님이
                                                    {notification.type === 'comment' ? ' 회원님의 게시글에 댓글을 남겼습니다.' :
                                                        notification.type === 'reply' ? ' 회원님의 댓글에 답글을 남겼습니다.' : ' 회원님의 글을 좋아합니다.'}
                                                </p>

                                                {/* 알림 내용 (댓글 내용) */}
                                                {notification.content && (
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 bg-black/20 p-2 rounded border border-gray-800/50 italic">
                                                        "{notification.content}"
                                                    </p>
                                                )}

                                                <p className="text-xs text-gray-500 mt-2 flex justify-between items-center">
                                                    <span className="line-clamp-1 max-w-[70%] font-medium text-gray-600 group-hover:text-gray-500 transition-colors">
                                                        {notification.post?.title}
                                                    </span>
                                                    <span>{formatDate(notification.createdAt)}</span>
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-arc-accent flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
