import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Share2, Lock, Check } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { SKILL_DATA } from '../data/skills';
import useStore from '../store/useStore';

// Base36 encoding helpers
const BASE36_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

// Get all skill IDs in a deterministic order (alphabetical)
const ALL_SKILL_IDS = Object.values(SKILL_DATA)
    .flatMap(category => category.skills.map(s => s.id))
    .sort();

const encodeSkills = (skillsState) => {
    const levels = ALL_SKILL_IDS.map(id => skillsState[id] || 0);
    let result = '';

    // Pack 2 levels into 1 char
    for (let i = 0; i < levels.length; i += 2) {
        const l1 = levels[i];
        const l2 = i + 1 < levels.length ? levels[i + 1] : 0;
        // Max level is 5. 6 possibilities (0-5).
        // Value = l1 * 6 + l2. Max val = 5*6 + 5 = 35.
        // Fits exactly in Base36 (0-35).
        const val = l1 * 6 + l2;
        result += BASE36_CHARS[val];
    }

    // Trim trailing zeros (which are '0' chars in this encoding)
    // Actually, '0' char means l1=0, l2=0.
    return result.replace(/0+$/, '');
};

const decodeSkills = (code) => {
    const newState = {};
    let levelIndex = 0;

    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const val = BASE36_CHARS.indexOf(char);
        if (val === -1) continue;

        const l1 = Math.floor(val / 6);
        const l2 = val % 6;

        if (levelIndex < ALL_SKILL_IDS.length) {
            if (l1 > 0) newState[ALL_SKILL_IDS[levelIndex]] = l1;
        }
        levelIndex++;

        if (levelIndex < ALL_SKILL_IDS.length) {
            if (l2 > 0) newState[ALL_SKILL_IDS[levelIndex]] = l2;
        }
        levelIndex++;
    }

    return newState;
};

const SkillNode = ({ skill, currentLevel, isLocked, isPrereqLocked, onAdd, onRemove, color }) => {
    const isMaxed = currentLevel >= skill.maxLevel;
    const isActive = currentLevel > 0;

    // Position tooltip below for top-row skills (y < 30), otherwise above
    const tooltipPosition = skill.y < 30 ? 'top-full mt-3' : 'bottom-full mb-3';

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-200 hover:z-[100]"
            style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
        >
            {/* Skill Icon Circle */}
            <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 cursor-pointer select-none
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
                <div className="w-full h-full p-1 rounded-full overflow-hidden relative flex items-center justify-center">
                    {skill.icon ? (
                        <img
                            src={skill.icon}
                            alt={skill.name}
                            className={`w-3/4 h-3/4 object-contain transition-all duration-300 ${isActive ? 'opacity-100 grayscale-0' : 'opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80'
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
                    <div className="absolute -top-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-700 z-20">
                        <Lock size={14} className="text-red-500" />
                    </div>
                )}
            </div>

            {/* Counter Pill */}
            <div className={`mt-1 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold border transition-colors whitespace-nowrap z-20
                ${isLocked
                    ? 'bg-gray-900 border-gray-800 text-gray-700'
                    : isMaxed
                        ? `bg-${color} border-${color} text-black`
                        : `bg-gray-900 border-gray-600 text-${color}`
                }
            `}>
                {currentLevel}/{skill.maxLevel}
            </div>

            {/* Tooltip (Desktop Only) */}
            <div className={`absolute ${tooltipPosition} hidden md:group-hover:block w-72 bg-gray-950 border border-gray-700 rounded-lg p-4 shadow-2xl z-50 pointer-events-none`}>
                <h4 className={`font-bold text-base mb-2 text-${color}`}>{skill.name}</h4>
                <p className="text-sm text-gray-300 mb-3 leading-relaxed whitespace-pre-wrap">{skill.description}</p>
                <div className="flex flex-col gap-1 text-xs text-gray-500 border-t border-gray-800 pt-2">
                    <div className="flex justify-between">
                        <span>Max Level: {skill.maxLevel}</span>
                        {skill.reqPoints > 0 && <span className={isLocked ? "text-red-500" : "text-green-500"}>Req: {skill.reqPoints} pts</span>}
                    </div>
                    {isPrereqLocked && (
                        <div className="text-red-500 font-bold flex items-center gap-1">
                            <Lock size={12} />
                            <span>이전 단계 스킬 필요</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SkillTreePage = () => {
    const [skillsState, setSkillsState] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [isCopied, setIsCopied] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null); // For mobile bottom sheet
    const { user, openLoginModal } = useStore();

    // Load state from URL on mount
    useEffect(() => {
        const codeParam = searchParams.get('code');
        const buildParam = searchParams.get('build');

        if (codeParam) {
            // New short format
            setSkillsState(decodeSkills(codeParam));
        } else if (buildParam) {
            // Legacy format
            try {
                const newState = {};
                buildParam.split(',').forEach(pair => {
                    const [id, level] = pair.split(':');
                    if (id && level) {
                        newState[id] = parseInt(level, 10);
                    }
                });
                setSkillsState(newState);
            } catch (e) {
                console.error("Failed to parse build param", e);
            }
        }
    }, [searchParams]);

    const handleSkillChange = (skillId, newLevel) => {
        setSkillsState(prev => ({
            ...prev,
            [skillId]: newLevel
        }));
    };

    const handleReset = () => {
        if (window.confirm('스킬 트리를 초기화하시겠습니까?')) {
            setSkillsState({});
            setSearchParams({}); // Clear URL
        }
    };

    const handleShare = () => {
        // 로그인 체크
        if (!user) {
            openLoginModal();
            return;
        }

        const code = encodeSkills(skillsState);
        const url = `${window.location.origin}${window.location.pathname}?code=${code}`;

        navigator.clipboard.writeText(url).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
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
                        >
            - 레벨 다운
                        </button >
    <button
        onClick={() => {
            const id = selectedSkill.id;
            if (skillsState[id] >= selectedSkill.maxLevel) return;
            handleSkillChange(id, (skillsState[id] || 0) + 1);
        }}
        className={`flex-1 py-3 rounded font-bold text-black
                                ${selectedSkill.category === 'conditioning' ? 'bg-green-500 hover:bg-green-400' :
                selectedSkill.category === 'mobility' ? 'bg-yellow-500 hover:bg-yellow-400' :
                    'bg-red-500 hover:bg-red-400'}
                            `}
    >
        + 레벨 업
    </button>
                    </div >
                </div >
            )}
        </div >
    );
};

export default SkillTreePage;
