import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { ArrowLeft, Share2, AlertCircle } from 'lucide-react';

const GRADE_COLORS = {
    Common: '#666871',
    Uncommon: '#35c15c',
    Rare: '#009bf4',
    Epic: '#d74798',
    Legendary: '#ffbf00'
};

const GRADE_KR = {
    Common: '일반',
    Uncommon: '고급',
    Rare: '희귀',
    Epic: '영웅',
    Legendary: '전설'
};

const WeaponDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { weapons, fetchWeapons } = useStore();
    const [weapon, setWeapon] = useState(null);

    const safeWeapons = Array.isArray(weapons) ? weapons : [];

    useEffect(() => {
        // Ensure weapons are loaded
        if (safeWeapons.length === 0) {
            fetchWeapons();
        }
    }, [fetchWeapons, safeWeapons.length]);

    useEffect(() => {
        if (safeWeapons.length > 0) {
            const found = safeWeapons.find(w => w._id === id);
            setWeapon(found);
        }
    }, [safeWeapons, id]);

    // 🛡️ Safety Warning: If ID mismatch occurs after DB reset (stale client cache)
    useEffect(() => {
        if (id && weapons.length > 0 && !weapon) {
            console.warn(`Weapon ID ${id} not found in loaded list. Stale cache suspected.`);
        }
    }, [id, weapons, weapon]);

    if (!weapon && safeWeapons.length === 0) return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
    if (!weapon && safeWeapons.length > 0) return (
        <div className="flex flex-col items-center justify-center h-screen text-white gap-4">
            <AlertCircle size={48} className="text-red-500" />
            <h2 className="text-xl font-bold">아이템을 찾을 수 없습니다</h2>
            <p className="text-gray-400">삭제되었거나 주소가 잘못되었습니다.</p>
            <button
                onClick={() => navigate('/weapons')}
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
            >
                목록으로 돌아가기
            </button>
        </div>
    );

    // Helper to render stat bar
    const StatBar = ({ label, value, max = 100 }) => (
        <div className="flex items-center gap-4 mb-2">
            <span className="w-24 text-sm font-bold text-gray-400">{label}</span>
            <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden relative">
                {/* Background bar */}
                <div
                    className="h-full bg-white relative z-10"
                    style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                />
            </div>
            <span className="w-12 text-sm font-bold text-right text-white">{value}</span>
        </div>
    );

    // Helper for table cells
    const TableCell = ({ children, className = "" }) => (
        <td className={`p-4 border border-gray-700 text-sm text-center align-top ${className}`}>
            {children}
        </td>
    );

    // Parsing stats object safely
    const stats = (weapon && weapon.stats) ? weapon.stats : {};
    // Parsing crafting array safely, filling up to 4 levels if missing
    const crafting = (weapon && weapon.crafting && Array.isArray(weapon.crafting)) ? weapon.crafting : [];
    const getLevelData = (lvl) => crafting.find(c => c.level === lvl) || {};



    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 overflow-y-auto pb-20">
            {/* Header / Nav */}
            <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
                <button
                    onClick={() => navigate('/weapons')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>목록으로</span>
                </button>
            </div>

            {/* Main Content Container mimicking the Wiki Card */}
            <div className="max-w-5xl mx-auto bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">

                {/* 1. Top Image Section */}
                <div
                    className="p-8 flex justify-center items-center min-h-[300px] relative transition-colors duration-500"
                    style={{
                        background: `linear-gradient(to bottom, ${GRADE_COLORS[weapon.grade || 'Common']}40, #1a1a1a)`
                    }}
                >
                    <img
                        src={weapon.imageUrl}
                        alt={weapon.name}
                        className="max-w-full max-h-[250px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    />
                    <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-black/50 border border-white/10 rounded">
                        {GRADE_KR[weapon.grade] || weapon.grade}
                    </div>
                </div>

                {/* 2. Info & Stats Section */}
                <div className="p-8 bg-[#e8e6dc] text-black"> {/* Wiki-like light beige bg */}
                    <h1 className="text-3xl font-black mb-1 text-black uppercase tracking-tighter">{weapon.nameKr || weapon.name}</h1>
                    <h2 className="text-lg text-gray-600 font-bold mb-6">{weapon.name}</h2>

                    <p className="text-gray-700 mb-8 leading-relaxed font-serif border-l-4 border-gray-400 pl-4 py-1 italic">
                        {weapon.description || "No description available."}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Properties Table */}
                        <div>
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    <tr className="border-b border-gray-300">
                                        <th className="py-2 text-left font-bold text-gray-600 w-1/3">탄약 유형</th>
                                        <td className="py-2 text-right font-medium">{weapon.ammoType || "-"}</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <th className="py-2 text-left font-bold text-gray-600">탄창 크기</th>
                                        <td className="py-2 text-right font-medium">{weapon.magazineSize || "-"}</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <th className="py-2 text-left font-bold text-gray-600">발사 모드</th>
                                        <td className="py-2 text-right font-medium">{weapon.fireMode || "-"}</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <th className="py-2 text-left font-bold text-gray-600">관통력</th>
                                        <td className="py-2 text-right font-medium">{weapon.penetration || "-"}</td>
                                    </tr>
                                    <tr className="border-b border-gray-300">
                                        <th className="py-2 text-left font-bold text-gray-600">무게</th>
                                        <td className="py-2 text-right font-medium">{weapon.weight ? `${weapon.weight}` : "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Right: Stats Bars */}
                        <div className="bg-[#1a1a1a] p-6 rounded-lg text-white shadow-inner">
                            <StatBar label="대미지" value={stats.damage || 0} />
                            <StatBar label="발사 속도" value={stats.fireRate || 0} />
                            <StatBar label="거리" value={stats.range || 0} />
                            <StatBar label="안정도" value={stats.stability || 0} />
                            <StatBar label="민첩성" value={stats.mobility || 0} />
                            <StatBar label="은신" value={stats.stealth || 0} max={10} /> {/* Stealth is usually low */}
                        </div>
                    </div>
                </div>

                {/* 3. Upgrade / Crafting Table */}
                <div className="border-t border-gray-800 bg-[#f5f5f5] text-black">

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#e0e0e0] border-b border-gray-300">
                                    <th className="p-3 w-32 border-r border-gray-300"></th>
                                    <th className="p-3 border-r border-gray-300 font-bold">1등급 (I)</th>
                                    <th className="p-3 border-r border-gray-300 font-bold">2등급 (II)</th>
                                    <th className="p-3 border-r border-gray-300 font-bold">3등급 (III)</th>
                                    <th className="p-3 font-bold">4등급 (IV)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Bonus Stats Row */}
                                <tr className="bg-white">
                                    <th className="p-3 border-r border-b border-gray-200 bg-[#f9f9f9] text-sm">추가 스탯</th>
                                    {[1, 2, 3, 4].map(lvl => {
                                        const data = getLevelData(lvl);
                                        return (
                                            <TableCell key={lvl} className="border-r border-b border-gray-200 bg-white">
                                                <div className="whitespace-pre-line text-xs font-medium text-blue-700 leading-relaxed">
                                                    {data.bonusStats || "-"}
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                </tr>

                                {/* Materials Row */}
                                <tr className="bg-white">
                                    <th className="p-3 border-r border-b border-gray-200 bg-[#f9f9f9] text-sm">필요 재료</th>
                                    {[1, 2, 3, 4].map(lvl => {
                                        const data = getLevelData(lvl);
                                        return (
                                            <TableCell key={lvl} className="border-r border-b border-gray-200">
                                                <div className="flex flex-col gap-1 text-xs text-left">
                                                    {data.materials?.map((mat, idx) => (
                                                        <div key={idx} className="flex justify-between">
                                                            <span className="text-gray-600">{mat.name}</span>
                                                            <span className="font-bold">{mat.count}</span>
                                                        </div>
                                                    ))}
                                                    {!data.materials && <span className="text-gray-400 text-center">-</span>}
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                </tr>

                                {/* Cost Row */}
                                <tr className="bg-[#f0f0f0]">
                                    <th className="p-3 border-r border-gray-300 text-sm">제작 비용</th>
                                    {[1, 2, 3, 4].map(lvl => {
                                        const data = getLevelData(lvl);
                                        return (
                                            <TableCell key={lvl} className="border-r border-gray-300 font-bold text-sm text-center">
                                                {data.cost ? `🪙 ${data.cost.toLocaleString()}` : "-"}
                                            </TableCell>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer removed as per request */}
        </div>
    );
};

export default WeaponDetailPage;
