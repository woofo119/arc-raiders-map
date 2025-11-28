import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Share2, Save } from 'lucide-react';
import { SKILL_DATA } from '../data/skillData';

const SkillTreePage = () => {
    const navigate = useNavigate();
    const MAX_TOTAL_POINTS = 170;

    // State for allocated points: { skillId: points }
    const [allocations, setAllocations] = useState({});
    const [totalPoints, setTotalPoints] = useState(0);

    // Calculate total points whenever allocations change
    useEffect(() => {
        const total = Object.values(allocations).reduce((sum, points) => sum + points, 0);
        setTotalPoints(total);
    }, [allocations]);

    const handleSkillClick = (skillId, maxPoints, isRightClick = false) => {
        setAllocations(prev => {
            const currentPoints = prev[skillId] || 0;
            let newPoints = currentPoints;

            if (isRightClick) {
                // Remove point
                if (currentPoints > 0) {
                    newPoints = currentPoints - 1;
                }
            } else {
                // Add point
                if (currentPoints < maxPoints && totalPoints < MAX_TOTAL_POINTS) {
                    newPoints = currentPoints + 1;
                }
            }

            if (newPoints === 0) {
                const { [skillId]: removed, ...rest } = prev;
                return rest;
            }

            return { ...prev, [skillId]: newPoints };
        });
    };

    const handleContextMenu = (e, skillId, maxPoints) => {
        e.preventDefault();
        handleSkillClick(skillId, maxPoints, true);
    };

    const handleReset = () => {
        if (window.confirm('모든 스킬 포인트를 초기화하시겠습니까?')) {
            setAllocations({});
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] text-gray-200 font-sans overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#141414]/90 backdrop-blur-md border-b border-gray-800 h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                        ARC Raiders KR 실시간 스킬 트리
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 font-mono">
                        <span className="text-gray-400">사용된 포인트:</span>
                        <span className={`text-xl font-bold ${totalPoints >= MAX_TOTAL_POINTS ? 'text-red-500' : 'text-white'}`}>
                            {totalPoints}
                        </span>
                        <span className="text-gray-600">/</span>
                        <span className="text-gray-600">{MAX_TOTAL_POINTS}</span>
                    </div>

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-bold"
                    >
                        <RotateCcw size={16} />
                        초기화
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6 max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {Object.values(SKILL_DATA).map((category) => (
                        <div
                            key={category.id}
                            className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col h-full"
                            style={{ borderColor: `${category.color}33` }} // 20% opacity border
                        >
                            <div className="mb-6 pb-4 border-b border-gray-800">
                                <h2 className="text-2xl font-bold flex items-center gap-3 mb-2" style={{ color: category.color }}>
                                    {category.label}
                                </h2>
                                <p className="text-gray-500 text-sm">{category.description}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {category.skills.map((skill) => {
                                    const currentPoints = allocations[skill.id] || 0;
                                    const isMaxed = currentPoints === skill.maxPoints;
                                    const isActive = currentPoints > 0;

                                    return (
                                        <div
                                            key={skill.id}
                                            onClick={() => handleSkillClick(skill.id, skill.maxPoints)}
                                            onContextMenu={(e) => handleContextMenu(e, skill.id, skill.maxPoints)}
                                            className={`
                                                relative p-4 rounded-lg border-2 transition-all cursor-pointer select-none group
                                                ${isActive ? 'bg-gray-800' : 'bg-[#141414] hover:bg-gray-800/50'}
                                            `}
                                            style={{
                                                borderColor: isActive ? category.color : '#2a2a2a',
                                                boxShadow: isActive ? `0 0 10px ${category.color}22` : 'none'
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className={`font-bold ${isActive ? 'text-white' : 'text-gray-400'} group-hover:text-white transition-colors`}>
                                                    {skill.name}
                                                </h3>
                                                <div
                                                    className={`
                                                        px-2 py-0.5 rounded text-xs font-bold font-mono
                                                        ${isMaxed ? 'text-black' : 'text-white'}
                                                    `}
                                                    style={{ backgroundColor: isMaxed ? category.color : '#333' }}
                                                >
                                                    {currentPoints} / {skill.maxPoints}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {skill.description}
                                            </p>

                                            {skill.isMajor && (
                                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: category.color }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Instructions Footer */}
                <div className="mt-12 text-center text-gray-500 text-sm flex justify-center gap-8">
                    <span>💡 왼쪽 클릭: 포인트 추가</span>
                    <span>🖱️ 오른쪽 클릭: 포인트 제거</span>
                    <span>⚡ 주요 스킬은 점으로 표시됩니다</span>
                </div>
            </main>
        </div>
    );
};

export default SkillTreePage;
