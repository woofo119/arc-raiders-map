import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Shield, User, Ban, Trash2, Search, AlertTriangle, Plus, X, Menu, Calendar, Clock, MapPin, FileText, MessageSquare, History } from 'lucide-react';

const AdminPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useStore();
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'blacklist'
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

    // User Management State
    const [users, setUsers] = useState([]);
    const [userPage, setUserPage] = useState(1);
    const [userPages, setUserPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // For details modal
    const [userDetails, setUserDetails] = useState(null); // Fetched details
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Blacklist State
    const [blacklist, setBlacklist] = useState([]);
    const [newIp, setNewIp] = useState('');
    const [newReason, setNewReason] = useState('');
    const [loadingBlacklist, setLoadingBlacklist] = useState(false);

    // Stats State
    const [stats, setStats] = useState({ today: 0, weekly: 0 });

    useEffect(() => {
        if (!isAuthenticated || (user && user.role !== 'admin')) {
            alert('관리자 권한이 필요합니다.');
            navigate('/');
            return;
        }

        fetchStats(); // Fetch stats immediately

        if (activeTab === 'users') {
            fetchUsers();
        } else {
            fetchBlacklist();
        }
    }, [isAuthenticated, user, activeTab, userPage, navigate]);

    const fetchStats = async () => {
        try {
            const token = user?.token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const token = user?.token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users?pageNumber=${userPage}&keyword=${keyword}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data.users);
                setUserPages(data.pages);
            } else {
                alert(data.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            setLoadingDetails(true);
            const token = user?.token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUserDetails(data);
            } else {
                alert(data.message || 'Failed to fetch user details');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const fetchBlacklist = async () => {
        try {
            setLoadingBlacklist(true);
            const token = user?.token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blacklist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setBlacklist(data);
            } else {
                alert(data.message || 'Failed to fetch blacklist');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingBlacklist(false);
        }
    };

    const handleBanUser = async (userId) => {
        if (!confirm('정말로 이 유저의 상태를 변경하시겠습니까?')) return;

        try {
            const token = user?.token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/ban`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                // Update local state
                setUsers(users.map(u => u._id === userId ? { ...u, isBanned: data.isBanned } : u));
                if (userDetails && userDetails.user._id === userId) {
                    setUserDetails({ ...userDetails, user: { ...userDetails.user, isBanned: data.isBanned } });
                }
            } else {
                alert(data.message || 'Failed to ban user');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddBlacklist = async (e) => {
        e.preventDefault();
        if (!newIp) return;

        try {
            const token = user?.token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blacklist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ip: newIp, reason: newReason })
            });
            const data = await response.json();
            if (response.ok) {
                setBlacklist([data, ...blacklist]);
                setNewIp('');
                setNewReason('');
            } else {
                alert(data.message || 'Failed to add IP');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveBlacklist = async (id) => {
        if (!confirm('정말로 이 IP 차단을 해제하시겠습니까?')) return;

        try {
            const token = user?.token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blacklist/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                setBlacklist(blacklist.filter(item => item._id !== id));
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to remove IP');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setUserPage(1);
        fetchUsers();
    };

    const openUserModal = (user) => {
        setSelectedUser(user);
        fetchUserDetails(user._id);
    };

    const closeUserModal = () => {
        setSelectedUser(null);
        setUserDetails(null);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-800 bg-[#121212] p-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu size={24} />
                    </button>
                    <Shield className="text-arc-accent" size={24} />
                    <h1 className="text-xl font-bold hidden md:block">Admin Dashboard</h1>
                    <h1 className="text-lg font-bold md:hidden">Admin</h1>
                </div>
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white text-sm">
                    Exit
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar (Desktop) */}
                <aside className="hidden md:flex w-64 bg-[#121212] border-r border-gray-800 p-4 flex-col gap-2">
                    <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
                </aside>

                {/* Sidebar (Mobile) */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-30 md:hidden">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
                        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#121212] border-r border-gray-800 p-4 flex flex-col gap-2 animate-in slide-in-from-left duration-200">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <span className="font-bold text-lg">Menu</span>
                                <button onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
                            </div>
                            <SidebarContent activeTab={activeTab} setActiveTab={(tab) => {
                                setActiveTab(tab);
                                setIsSidebarOpen(false);
                            }} />
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto">
                        <div className="bg-[#121212] p-6 rounded-xl border border-gray-800 flex flex-col">
                            <span className="text-gray-500 text-sm font-bold uppercase mb-2">오늘 방문자 (전체)</span>
                            <span className="text-3xl font-black text-white">{stats.today.toLocaleString()}</span>
                            <span className="text-gray-600 text-xs mt-1">비회원 포함 모든 접속</span>
                        </div>
                        <div className="bg-[#121212] p-6 rounded-xl border border-gray-800 flex flex-col">
                            <span className="text-gray-500 text-sm font-bold uppercase mb-2">주간 방문자 (전체)</span>
                            <span className="text-3xl font-black text-arc-accent">{stats.weekly.toLocaleString()}</span>
                            <span className="text-gray-600 text-xs mt-1">최근 7일간 방문자 수</span>
                        </div>
                        <div className="bg-[#121212] p-6 rounded-xl border border-gray-800 flex flex-col">
                            <span className="text-gray-500 text-sm font-bold uppercase mb-2">총 가입 유저</span>
                            <span className="text-3xl font-black text-white">{stats.totalUsers ? stats.totalUsers.toLocaleString() : 0}</span>
                            <span className="text-gray-600 text-xs mt-1">현재까지 가입한 모든 회원</span>
                        </div>
                        <div className="bg-[#121212] p-6 rounded-xl border border-gray-800 flex flex-col">
                            <span className="text-gray-500 text-sm font-bold uppercase mb-2">실시간 접속자 (회원)</span>
                            <span className="text-3xl font-black text-white">{stats.activeUsers ? stats.activeUsers.toLocaleString() : 0}</span>
                            <span className="text-gray-600 text-xs mt-1">로그인 중인 유저 (5분 이내)</span>
                        </div>
                    </div>

                    {activeTab === 'users' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <h2 className="text-2xl font-bold">회원 목록</h2>
                                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="검색..."
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-arc-accent outline-none min-w-0"
                                    />
                                    <button type="submit" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-white shrink-0">
                                        <Search size={18} />
                                    </button>
                                </form>
                            </div>

                            {loadingUsers ? (
                                <div className="text-center py-20 text-gray-500">Loading...</div>
                            ) : (
                                <>
                                    {/* Desktop Table */}
                                    <div className="hidden md:block bg-[#121212] rounded-xl border border-gray-800 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-900 text-gray-400 text-xs uppercase font-bold">
                                                <tr>
                                                    <th className="px-6 py-4">유저</th>
                                                    <th className="px-6 py-4">역할</th>
                                                    <th className="px-6 py-4">레벨</th>
                                                    <th className="px-6 py-4">최근 방문</th>
                                                    <th className="px-6 py-4">누적 방문</th>
                                                    <th className="px-6 py-4">가입일</th>
                                                    <th className="px-6 py-4">상태</th>
                                                    <th className="px-6 py-4 text-right">관리</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800">
                                                {users.map((u) => (
                                                    <tr key={u._id} className="hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => openUserModal(u)}>
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-white">{u.nickname || u.username}</div>
                                                            <div className="text-xs text-gray-500">{u.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-300'}`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-300">{u.level}</td>
                                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                                            {u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                                            {u.visitCount || 1}회
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                                            {new Date(u.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {u.isBanned ? (
                                                                <span className="text-red-500 font-bold flex items-center gap-1">
                                                                    <Ban size={14} /> 차단됨
                                                                </span>
                                                            ) : (
                                                                <span className="text-green-500 font-bold">정상</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                            {u.role !== 'admin' && (
                                                                <button
                                                                    onClick={() => handleBanUser(u._id)}
                                                                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${u.isBanned ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                                                                >
                                                                    {u.isBanned ? '차단 해제' : '차단'}
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card List */}
                                    <div className="md:hidden space-y-4">
                                        {users.map((u) => (
                                            <div key={u._id} className="bg-[#121212] rounded-xl border border-gray-800 p-4" onClick={() => openUserModal(u)}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="font-bold text-white text-lg">{u.nickname || u.username}</div>
                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-300'}`}>
                                                        {u.role}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                                                    <span>Lv.{u.level}</span>
                                                    <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                                                    {u.isBanned ? (
                                                        <span className="text-red-500 font-bold flex items-center gap-1 text-sm">
                                                            <Ban size={14} /> 차단됨
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-500 font-bold text-sm">정상</span>
                                                    )}
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleBanUser(u._id);
                                                            }}
                                                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${u.isBanned ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                                                        >
                                                            {u.isBanned ? '차단 해제' : '차단'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Pagination */}
                            {userPages > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    {[...Array(userPages).keys()].map(x => (
                                        <button
                                            key={x + 1}
                                            onClick={() => setUserPage(x + 1)}
                                            className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${userPage === x + 1 ? 'bg-arc-accent text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                        >
                                            {x + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'blacklist' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6">IP 블랙리스트</h2>

                            <div className="bg-[#121212] rounded-xl border border-gray-800 p-6 mb-8">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Plus size={18} className="text-arc-accent" />
                                    IP 차단 추가
                                </h3>
                                <form onSubmit={handleAddBlacklist} className="flex flex-col md:flex-row gap-4 items-end">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs text-gray-500 mb-1">IP Address</label>
                                        <input
                                            type="text"
                                            placeholder="ex) 192.168.1.1"
                                            value={newIp}
                                            onChange={(e) => setNewIp(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:border-arc-accent outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="flex-[2] w-full">
                                        <label className="block text-xs text-gray-500 mb-1">Reason</label>
                                        <input
                                            type="text"
                                            placeholder="차단 사유"
                                            value={newReason}
                                            onChange={(e) => setNewReason(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:border-arc-accent outline-none"
                                        />
                                    </div>
                                    <button type="submit" className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors">
                                        차단하기
                                    </button>
                                </form>
                            </div>

                            <div className="bg-[#121212] rounded-xl border border-gray-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[600px]">
                                        <thead className="bg-gray-900 text-gray-400 text-xs uppercase font-bold">
                                            <tr>
                                                <th className="px-6 py-4">IP Address</th>
                                                <th className="px-6 py-4">Reason</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Admin</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {blacklist.map((item) => (
                                                <tr key={item._id} className="hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-yellow-500">{item.ip}</td>
                                                    <td className="px-6 py-4 text-gray-300">{item.reason}</td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                                        {item.createdBy?.nickname || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleRemoveBlacklist(item._id)}
                                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                                            title="차단 해제"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {blacklist.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                        차단된 IP가 없습니다.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-[#1a1a1a]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                                    <User size={24} className="text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        {selectedUser.nickname || selectedUser.username}
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedUser.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-400'}`}>
                                            {selectedUser.role}
                                        </span>
                                    </h3>
                                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button onClick={closeUserModal} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {loadingDetails || !userDetails ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arc-accent"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                                            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Calendar size={12} /> 가입일</div>
                                            <div className="font-bold text-sm">{new Date(userDetails.user.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                                            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Clock size={12} /> 마지막 활동</div>
                                            <div className="font-bold text-sm">
                                                {userDetails.user.lastActiveAt ? new Date(userDetails.user.lastActiveAt).toLocaleString() : '-'}
                                            </div>
                                        </div>
                                        <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                                            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Shield size={12} /> 레벨</div>
                                            <div className="font-bold text-sm">Lv.{userDetails.user.level}</div>
                                        </div>
                                        <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                                            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1"><AlertTriangle size={12} /> 상태</div>
                                            <div className={`font-bold text-sm ${userDetails.user.isBanned ? 'text-red-500' : 'text-green-500'}`}>
                                                {userDetails.user.isBanned ? 'Banned' : 'Active'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* History Section */}
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                                <History size={16} /> 닉네임 변경 이력
                                            </h4>
                                            <div className="bg-black/30 rounded-xl border border-gray-800 overflow-hidden">
                                                {userDetails.user.nicknameHistory && userDetails.user.nicknameHistory.length > 0 ? (
                                                    <div className="divide-y divide-gray-800">
                                                        {userDetails.user.nicknameHistory.map((history, idx) => (
                                                            <div key={idx} className="p-3 flex justify-between items-center text-sm">
                                                                <span className="text-gray-300">{history.nickname}</span>
                                                                <span className="text-gray-500 text-xs">{new Date(history.changedAt).toLocaleDateString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500 text-sm">변경 이력이 없습니다.</div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                                <MapPin size={16} /> 접속 IP 이력
                                            </h4>
                                            <div className="bg-black/30 rounded-xl border border-gray-800 overflow-hidden max-h-40 overflow-y-auto">
                                                {userDetails.user.ipHistory && userDetails.user.ipHistory.length > 0 ? (
                                                    <div className="divide-y divide-gray-800">
                                                        {userDetails.user.ipHistory.slice().reverse().map((history, idx) => (
                                                            <div key={idx} className="p-3 flex justify-between items-center text-sm">
                                                                <span className="font-mono text-yellow-500/80">{history.ip}</span>
                                                                <span className="text-gray-500 text-xs">{new Date(history.date).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500 text-sm">기록이 없습니다.</div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                                <FileText size={16} /> 최근 게시글
                                            </h4>
                                            <div className="bg-black/30 rounded-xl border border-gray-800 overflow-hidden">
                                                {userDetails.posts && userDetails.posts.length > 0 ? (
                                                    <div className="divide-y divide-gray-800">
                                                        {userDetails.posts.map((post) => (
                                                            <div key={post._id} className="p-3 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => window.open(`/community/${post._id}`, '_blank')}>
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className="font-medium text-gray-200 line-clamp-1">{post.title}</span>
                                                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{new Date(post.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <span className="flex items-center gap-1"><MessageSquare size={10} /> {post.comments?.length || 0}</span>
                                                                    <span>•</span>
                                                                    <span>조회 {post.views}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500 text-sm">작성한 게시글이 없습니다.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-800 bg-[#121212] flex justify-end gap-2">
                            {userDetails && userDetails.user.role !== 'admin' && (
                                <button
                                    onClick={() => handleBanUser(userDetails.user._id)}
                                    className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${userDetails.user.isBanned ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                                >
                                    <Ban size={16} />
                                    {userDetails.user.isBanned ? '차단 해제' : '사용자 차단'}
                                </button>
                            )}
                            <button onClick={closeUserModal} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors">
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarContent = ({ activeTab, setActiveTab }) => (
    <>
        <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-arc-accent text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
        >
            <User size={20} />
            회원 관리
        </button>
        <button
            onClick={() => setActiveTab('blacklist')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'blacklist' ? 'bg-arc-accent text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
        >
            <Ban size={20} />
            IP 블랙리스트
        </button>
    </>
);

export default AdminPage;
