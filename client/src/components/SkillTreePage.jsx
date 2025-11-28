import React, { useState, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Share2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SKILL_DATA } from '../data/skills';

const SkillNode = ({ skill, currentLevel, isLocked, isPrereqLocked, onAdd, onRemove, color }) => {
    const isMaxed = currentLevel >= skill.maxLevel;
    const isActive = currentLevel > 0;

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
            style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
        >
            {/* Skill Icon Circle */}
            <div
                className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 cursor-pointer select-none
                    ${isLocked
                        ? 'border-gray-700 bg-gray-900/50 text-gray-700'
                        : isActive
                            ? `border-${color} bg-gray-800 text-${color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`
                            : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-400'
                    }
                    ${isMaxed ? `bg-${color}/10 shadow-[0_0_10px_rgba(var(--color-${color}),0.3)]` : ''}
                `}
                onClick={(e) => {
                    e.preventDefault();
                    if (!isLocked) onAdd(skill.id);
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onRemove(skill.id);
                }}
            >
                {/* Icon */}
                <div className="w-full h-full p-1 rounded-full overflow-hidden relative">
                    {skill.icon ? (
                        <img
                            src={skill.icon}
                            alt={skill.name}
                            className={`w-full h-full object-cover transition-all duration-300 ${isActive ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80'
                                }`}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div class="text-[8px] text-center">${skill.name}</div>`;
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-xs font-bold">{skill.name.slice(0, 1)}</div>
                        </div>
                    )}
                </div>

                {/* Lock Overlay */}
                {isLocked && (
                    <div className="absolute -top-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-700">
                        <Lock size={12} className="text-red-500" />
                    </div>
                )}
            </div>

            {/* Counter Pill */}
            <div className={`mt-1 px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold border transition-colors whitespace-nowrap z-20
                ${isLocked
                    ? 'bg-gray-900 border-gray-800 text-gray-700'
                    : isMaxed
                        ? `bg-${color} border-${color} text-black`
                        : `bg-gray-900 border-gray-600 text-${color}`
                }
            `}>
                {currentLevel}/{skill.maxLevel}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 bg-gray-950 border border-gray-700 rounded-lg p-3 shadow-xl z-50 pointer-events-none">
                <h4 className={`font-bold text-sm mb-1 text-${color}`}>{skill.name}</h4>
                <p className="text-xs text-gray-300 mb-2 leading-relaxed whitespace-pre-wrap">{skill.description}</p>
                <div className="flex flex-col gap-1 text-[10px] text-gray-500 border-t border-gray-800 pt-2">
                    <div className="flex justify-between">
                        <span>Max Level: {skill.maxLevel}</span>
                        {skill.reqPoints > 0 && <span className={isLocked ? "text-red-500" : "text-green-500"}>Req: {skill.reqPoints} pts</span>}
                    </div>
                    {isPrereqLocked && (
                        <div className="text-red-500 font-bold">
                            🔒 이전 단계 스킬 필요
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SkillTreePage = () => {
    const [skillsState, setSkillsState] = useState({});

    const handleSkillChange = (skillId, newLevel) => {
        setSkillsState(prev => ({
            ...prev,
            [skillId]: newLevel
        }));
    };

    const handleReset = () => {
        if (window.confirm('스킬 트리를 초기화하시겠습니까?')) {
            setSkillsState({});
        }
    };

    // Calculate total points per category
    const points = useMemo(() => {
        const result = { conditioning: 0, mobility: 0, survival: 0, total: 0 };
        Object.keys(SKILL_DATA).forEach(key => {
            SKILL_DATA[key].skills.forEach(skill => {
                const level = skillsState[skill.id] || 0;
                result[key] += level;
                result.total += level;
            });
        });
        return result;
    }, [skillsState]);

    // Flatten all skills for rendering
    const allSkills = useMemo(() => {
        return [
            ...SKILL_DATA.conditioning.skills.map(s => ({ ...s, category: 'conditioning' })),
            ...SKILL_DATA.mobility.skills.map(s => ({ ...s, category: 'mobility' })),
            ...SKILL_DATA.survival.skills.map(s => ({ ...s, category: 'survival' }))
        ];
    }, []);

    // SVG Lines Data (Extracted from skill.txt)
    const lines = [
        { x1: 23.74, y1: 72.48, x2: 20.84, y2: 66.68 },
        { x1: 26.26, y1: 72.48, x2: 29.16, y2: 66.68 },
        { x1: 20.0, y1: 63.13, x2: 20.0, y2: 56.88 },
        { x1: 30.0, y1: 63.13, x2: 30.0, y2: 56.88 },
        { x1: 20.0, y1: 53.13, x2: 20.0, y2: 47.81 },
        { x1: 30.0, y1: 53.13, x2: 30.0, y2: 47.81 },
        { x1: 21.26, y1: 42.48, x2: 24.16, y2: 36.68 },
        { x1: 28.74, y1: 42.48, x2: 25.84, y2: 36.68 },
        { x1: 20.0, y1: 42.19, x2: 20.0, y2: 36.88 },
        { x1: 30.0, y1: 42.19, x2: 30.0, y2: 36.88 },
        { x1: 25.0, y1: 33.13, x2: 25.0, y2: 26.88 },
        { x1: 20.0, y1: 33.13, x2: 20.0, y2: 26.88 },
        { x1: 30.0, y1: 33.13, x2: 30.0, y2: 26.88 },
        { x1: 20.0, y1: 23.13, x2: 20.0, y2: 17.81 },
        { x1: 24.16, y1: 23.32, x2: 21.26, y2: 17.52 },
        { x1: 30.0, y1: 23.13, x2: 30.0, y2: 17.81 },
        { x1: 25.84, y1: 23.32, x2: 28.74, y2: 17.52 },
        { x1: 48.74, y1: 72.48, x2: 45.84, y2: 66.68 },
        { x1: 51.26, y1: 72.48, x2: 54.16, y2: 66.68 },
        { x1: 45.0, y1: 63.13, x2: 45.0, y2: 56.88 },
        { x1: 55.0, y1: 63.13, x2: 55.0, y2: 56.88 },
        { x1: 45.0, y1: 53.13, x2: 45.0, y2: 47.81 },
        { x1: 55.0, y1: 53.13, x2: 55.0, y2: 47.81 },
        { x1: 46.26, y1: 42.48, x2: 49.16, y2: 36.68 },
        { x1: 53.74, y1: 42.48, x2: 50.84, y2: 36.68 },
        { x1: 45.0, y1: 42.19, x2: 45.0, y2: 36.88 },
        { x1: 55.0, y1: 42.19, x2: 55.0, y2: 36.88 },
        { x1: 50.0, y1: 33.13, x2: 50.0, y2: 26.88 },
        { x1: 45.0, y1: 33.13, x2: 45.0, y2: 26.88 },
        { x1: 55.0, y1: 33.13, x2: 55.0, y2: 26.88 },
        { x1: 45.0, y1: 23.13, x2: 45.0, y2: 17.81 },
        { x1: 49.16, y1: 23.32, x2: 46.26, y2: 17.52 },
        { x1: 55.0, y1: 23.13, x2: 55.0, y2: 17.81 },
        { x1: 50.84, y1: 23.32, x2: 53.74, y2: 17.52 },
        { x1: 73.74, y1: 72.48, x2: 70.84, y2: 66.68 },
        { x1: 76.26, y1: 72.48, x2: 79.16, y2: 66.68 },
        { x1: 70.0, y1: 63.13, x2: 70.0, y2: 56.88 },
        { x1: 80.0, y1: 63.13, x2: 80.0, y2: 56.88 },
        { x1: 70.0, y1: 53.13, x2: 70.0, y2: 47.81 },
        { x1: 80.0, y1: 53.13, x2: 80.0, y2: 47.81 },
        { x1: 71.26, y1: 42.48, x2: 74.16, y2: 36.68 },
        { x1: 78.74, y1: 42.48, x2: 75.84, y2: 36.68 },
        { x1: 70.0, y1: 42.19, x2: 70.0, y2: 36.88 },
        { x1: 80.0, y1: 42.19, x2: 80.0, y2: 36.88 },
        { x1: 75.0, y1: 33.13, x2: 75.0, y2: 26.88 },
        { x1: 70.0, y1: 33.13, x2: 70.0, y2: 26.88 },
        { x1: 80.0, y1: 33.13, x2: 80.0, y2: 26.88 },
        { x1: 70.0, y1: 23.13, x2: 70.0, y2: 17.81 },
        { x1: 74.16, y1: 23.32, x2: 71.26, y2: 17.52 },
        { x1: 80.0, y1: 23.13, x2: 80.0, y2: 17.81 },
        { x1: 75.84, y1: 23.32, x2: 78.74, y2: 17.52 }
    ];

    return (
        <div className="flex-1 relative h-full bg-[#0a0a0a] overflow-hidden flex flex-col text-white">
            {/* Top Navigation Bar */}
            <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-sm z-30">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">메인으로</span>
                    </Link>
                    <div className="h-4 w-px bg-gray-700 mx-2" />
                    <h1 className="text-lg font-bold text-yellow-500">스킬 트리</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm">
                        <span className="text-gray-400">사용된 스킬 포인트: </span>
                        <span className="text-yellow-500 font-bold text-lg">{points.total}</span>
                    </div>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors border border-gray-700"
                    >
                        <RotateCcw size={14} />
                        <span>트리 초기화</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 rounded-md text-sm transition-colors text-black font-bold">
                        <Share2 size={14} />
                        <span>공유</span>
                    </button>
                </div>
            </div>

            {/* Header / Points Display (Floating) */}
            <div className="absolute top-20 left-0 right-0 h-20 z-20 pointer-events-none">
                <div className="absolute left-[25%] -translate-x-1/2 text-center">
                    <h2 className="text-green-500 font-bold text-xl md:text-2xl drop-shadow-lg">{SKILL_DATA.conditioning.label}</h2>
                    <p className="text-green-400/80 text-sm font-mono">{points.conditioning} 포인트</p>
                </div>
                <div className="absolute left-[50%] -translate-x-1/2 text-center">
                    <h2 className="text-yellow-500 font-bold text-xl md:text-2xl drop-shadow-lg">{SKILL_DATA.mobility.label}</h2>
                    <p className="text-yellow-400/80 text-sm font-mono">{points.mobility} 포인트</p>
                </div>
                <div className="absolute left-[75%] -translate-x-1/2 text-center">
                    <h2 className="text-red-500 font-bold text-xl md:text-2xl drop-shadow-lg">{SKILL_DATA.survival.label}</h2>
                    <p className="text-red-400/80 text-sm font-mono">{points.survival} 포인트</p>
                </div>
            </div>

            {/* Main SVG/HTML Container */}
            <div className="flex-1 relative w-full h-full min-h-[600px] overflow-auto custom-scrollbar">
                <div className="relative w-full h-full min-w-[1000px] min-h-[800px]">
                    {/* Background Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {lines.map((line, i) => (
                            <line
                                key={i}
                                x1={`${line.x1}%`}
                                y1={`${line.y1}%`}
                                x2={`${line.x2}%`}
                                y2={`${line.y2}%`}
                                stroke="#333"
                                strokeWidth="2"
                                className="opacity-60"
                            />
                        ))}
                    </svg>

                    {/* Skill Nodes */}
                    {allSkills.map(skill => {
                        const totalPoints = points[skill.category];
                        // Check if locked by points
                        const isPointsLocked = skill.reqPoints > totalPoints;

                        // Check if locked by prerequisites (parent must be active)
                        const isPrereqLocked = skill.prerequisites && skill.prerequisites.length > 0 &&
                            !skill.prerequisites.some(pid => skillsState[pid] > 0);

                        const isLocked = isPointsLocked || isPrereqLocked;

                        return (
                            <SkillNode
                                key={skill.id}
                                skill={skill}
                                currentLevel={skillsState[skill.id] || 0}
                                isLocked={isLocked}
                                isPrereqLocked={isPrereqLocked}
                                color={skill.category === 'conditioning' ? 'green-500' : skill.category === 'mobility' ? 'yellow-500' : 'red-500'}
                                onAdd={(id) => {
                                    if (skillsState[id] >= skill.maxLevel) return;
                                    handleSkillChange(id, (skillsState[id] || 0) + 1);
                                }}
                                onRemove={(id) => {
                                    if (!skillsState[id] || skillsState[id] <= 0) return;
                                    handleSkillChange(id, skillsState[id] - 1);
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SkillTreePage;
