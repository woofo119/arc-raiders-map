import { useState, useMemo } from 'react';
import { SKILL_DATA } from '../data/skills';
import { Shield, Zap, Heart, Lock, Info, Check } from 'lucide-react';

const SkillNode = ({ skill, currentLevel, isLocked, onAdd, onRemove, color }) => {
    const isMaxed = currentLevel >= skill.maxLevel;
    const isActive = currentLevel > 0;

    return (
        <div className="relative flex flex-col items-center group z-10">
            {/* Skill Icon Circle */}
            <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 cursor-pointer
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
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            {skill.maxLevel === 1 ? <Check size={24} /> : <div className="text-xs font-bold">{skill.name.slice(0, 1)}</div>}
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
            <div className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors
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
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl z-50 pointer-events-none">
                <h4 className={`font-bold text-sm mb-1 text-${color}`}>{skill.name}</h4>
                <p className="text-xs text-gray-400 mb-2">{skill.description}</p>
                <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Max Level: {skill.maxLevel}</span>
                    {skill.reqPoints > 0 && <span>Req: {skill.reqPoints} pts</span>}
                </div>
            </div>
        </div>
    );
};

const SkillTreeColumn = ({ categoryKey, data, skillsState, onSkillChange }) => {
    const totalPoints = useMemo(() => {
        return data.skills.reduce((sum, skill) => sum + (skillsState[skill.id] || 0), 0);
    }, [data, skillsState]);

    // Group skills by row for rendering
    const rows = useMemo(() => {
        const grouped = {};
        data.skills.forEach(skill => {
            if (!grouped[skill.row]) grouped[skill.row] = [];
            grouped[skill.row].push(skill);
        });
        return grouped;
    }, [data]);

    const maxRow = Math.max(...Object.keys(rows).map(Number));

    return (
        <div className="flex-1 flex flex-col items-center min-w-[250px]">
            {/* Header */}
            <div className="mb-8 text-center">
                <h2 className={`text-2xl font-bold mb-1 ${data.color.replace('text-', 'text-')}`}>{data.label}</h2>
                <p className={`text-sm font-bold ${data.color}`}>{totalPoints} 포인트</p>
            </div>

            {/* Tree Container */}
            <div className="relative flex flex-col-reverse gap-8 p-4">
                {/* SVG Lines Background - Simplified for vertical flow */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    {/* Add lines here if needed, complex to calculate exactly without fixed positions */}
                    <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="currentColor" strokeWidth="2" className="text-gray-700" />
                </svg>

                {Array.from({ length: maxRow + 1 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-8 relative z-10 w-full">
                        {rows[rowIndex]?.map(skill => {
                            const isLocked = skill.reqPoints > totalPoints;
                            return (
                                <SkillNode
                                    key={skill.id}
                                    skill={skill}
                                    currentLevel={skillsState[skill.id] || 0}
                                    isLocked={isLocked}
                                    color={categoryKey === 'conditioning' ? 'green-500' : categoryKey === 'mobility' ? 'yellow-500' : 'red-500'}
                                    onAdd={(id) => {
                                        if (skillsState[id] >= skill.maxLevel) return;
                                        onSkillChange(id, (skillsState[id] || 0) + 1);
                                    }}
                                    onRemove={(id) => {
                                        if (!skillsState[id] || skillsState[id] <= 0) return;
                                        onSkillChange(id, skillsState[id] - 1);
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SkillTreePage = () => {
    // State to track skill levels: { [skillId]: level }
    const [skillsState, setSkillsState] = useState({});

    const handleSkillChange = (skillId, newLevel) => {
        setSkillsState(prev => ({
            ...prev,
            [skillId]: newLevel
        }));
    };

    return (
        <div className="flex-1 relative h-full bg-[#0a0a0a] overflow-y-auto overflow-x-hidden">
            <div className="min-h-full flex justify-center p-10 gap-4">
                <SkillTreeColumn
                    categoryKey="conditioning"
                    data={SKILL_DATA.conditioning}
                    skillsState={skillsState}
                    onSkillChange={handleSkillChange}
                />
                <SkillTreeColumn
                    categoryKey="mobility"
                    data={SKILL_DATA.mobility}
                    skillsState={skillsState}
                    onSkillChange={handleSkillChange}
                />
                <SkillTreeColumn
                    categoryKey="survival"
                    data={SKILL_DATA.survival}
                    skillsState={skillsState}
                    onSkillChange={handleSkillChange}
                />
            </div>
        </div>
    );
};

export default SkillTreePage;
