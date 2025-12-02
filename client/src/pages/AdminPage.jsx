import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Shield, User, Ban, Trash2, Search, AlertTriangle, Plus } from 'lucide-react';

const AdminPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useStore();
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'blacklist'

    // User Management State
    const [users, setUsers] = useState([]);
    const [userPage, setUserPage] = useState(1);
    const [userPages, setUserPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Blacklist State
    const [blacklist, setBlacklist] = useState([]);
    const [newIp, setNewIp] = useState('');
    const [newReason, setNewReason] = useState('');
    const [loadingBlacklist, setLoadingBlacklist] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || (user && user.role !== 'admin')) {
            alert('관리자 권한이 필요합니다.');
            navigate('/');
            return;
        }

        if (activeTab === 'users') {
            fetchUsers();
        } else {
            fetchBlacklist();
        }
    }, [isAuthenticated, user, activeTab, userPage, navigate]);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const token = localStorage.getItem('token');
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

    const fetchBlacklist = async () => {
        try {
            setLoadingBlacklist(true);
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/ban`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                // Update local state
                setUsers(users.map(u => u._id === userId ? { ...u, isBanned: data.isBanned } : u));
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
            const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
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

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-800 bg-[#121212] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="text-arc-accent" size={24} />
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                </div>
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white text-sm">
                    Exit to App
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-[#121212] border-r border-gray-800 p-4 flex flex-col gap-2">
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
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'users' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">회원 목록</h2>
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="닉네임 또는 이메일 검색"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-arc-accent outline-none"
                                    />
                                    <button type="submit" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-white">
                                        <Search size={18} />
                                    </button>
                                </form>
                            </div>

                            {loadingUsers ? (
                                <div className="text-center py-20 text-gray-500">Loading...</div>
                            ) : (
                                <div className="bg-[#121212] rounded-xl border border-gray-800 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-900 text-gray-400 text-xs uppercase font-bold">
                                            <tr>
                                                <th className="px-6 py-4">User</th>
                                                <th className="px-6 py-4">Role</th>
                                                <th className="px-6 py-4">Level</th>
                                                <th className="px-6 py-4">Joined</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {users.map((u) => (
                                                <tr key={u._id} className="hover:bg-gray-800/50 transition-colors">
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
                                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {u.isBanned ? (
                                                            <span className="text-red-500 font-bold flex items-center gap-1">
                                                                <Ban size={14} /> Banned
                                                            </span>
                                                        ) : (
                                                            <span className="text-green-500 font-bold">Active</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {u.role !== 'admin' && (
                                                            <button
                                                                onClick={() => handleBanUser(u._id)}
                                                                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${u.isBanned ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                                                            >
                                                                {u.isBanned ? 'Unban' : 'Ban'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
                            <h2 className="text-2xl font-bold mb-6">IP 블랙리스트 관리</h2>

                            <div className="bg-[#121212] rounded-xl border border-gray-800 p-6 mb-8">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Plus size={18} className="text-arc-accent" />
                                    IP 차단 추가
                                </h3>
                                <form onSubmit={handleAddBlacklist} className="flex gap-4 items-end">
                                    <div className="flex-1">
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
                                    <div className="flex-[2]">
                                        <label className="block text-xs text-gray-500 mb-1">Reason</label>
                                        <input
                                            type="text"
                                            placeholder="차단 사유"
                                            value={newReason}
                                            onChange={(e) => setNewReason(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:border-arc-accent outline-none"
                                        />
                                    </div>
                                    <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors">
                                        차단하기
                                    </button>
                                </form>
                            </div>

                            <div className="bg-[#121212] rounded-xl border border-gray-800 overflow-hidden">
                                <table className="w-full text-left">
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
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
