import { useState, useMemo } from 'react';
import { SKILL_DATA } from '../data/skills';
import { Shield, Zap, Heart, Lock, Check } from 'lucide-react';

const SkillNode = ({ skill, currentLevel, isLocked, onAdd, onRemove, color }) => {
    const isMaxed = currentLevel >= skill.maxLevel;
    const isActive = currentLevel > 0;

    // SVG coordinates are 0-100, convert to percentage for absolute positioning
    // Note: In SVG, (0,0) is top-left. The provided coordinates seem to match this.
    // x is 0-100, y is 0-100.

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
            style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
        >
            {/* Skill Icon Circle */}
            <div
                className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 cursor-pointer
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
            <div className={`mt-1 px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold border transition-colors whitespace-nowrap
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

const SkillTreePage = () => {
    const [skillsState, setSkillsState] = useState({});

    const handleSkillChange = (skillId, newLevel) => {
        setSkillsState(prev => ({
            ...prev,
            [skillId]: newLevel
        }));
    };

    // Calculate total points per category
    const points = useMemo(() => {
        const result = { conditioning: 0, mobility: 0, survival: 0 };
        Object.keys(SKILL_DATA).forEach(key => {
            SKILL_DATA[key].skills.forEach(skill => {
                result[key] += (skillsState[skill.id] || 0);
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

    return (
        <div className="flex-1 relative h-full bg-[#0a0a0a] overflow-hidden flex flex-col">
            {/* Header / Points Display */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-20 z-20 pointer-events-none">
                <div className="text-center">
                    <h2 className="text-green-500 font-bold text-xl">컨디셔닝</h2>
                    <p className="text-green-500 text-sm">{points.conditioning} 포인트</p>
                </div>
                <div className="text-center">
                    <h2 className="text-yellow-500 font-bold text-xl">기동성</h2>
                    <p className="text-yellow-500 text-sm">{points.mobility} 포인트</p>
                </div>
                <div className="text-center">
                    <h2 className="text-red-500 font-bold text-xl">생존</h2>
                    <p className="text-red-500 text-sm">{points.survival} 포인트</p>
                </div>
            </div>

            {/* Main SVG/HTML Container */}
            <div className="flex-1 relative w-full h-full min-h-[600px] overflow-auto">
                <div className="relative w-full h-full min-w-[1000px] min-h-[800px]">
                    {/* Background Lines (SVG) - Reusing lines from skill.txt logic or just simple connections */}
                    {/* Since we don't have the exact line coordinates from the file easily mapped to IDs, 
                        we will use the background image or just leave lines empty for now, 
                        OR we can try to render the lines from the file if we extracted them. 
                        For now, let's focus on nodes. */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                        {/* Placeholder for lines */}
                    </svg>

                    {/* Skill Nodes */}
                    {allSkills.map(skill => {
                        const totalPoints = points[skill.category];
                        const isLocked = skill.reqPoints > totalPoints;
                        return (
                            <SkillNode
                                key={skill.id}
                                skill={skill}
                                currentLevel={skillsState[skill.id] || 0}
                                isLocked={isLocked}
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
