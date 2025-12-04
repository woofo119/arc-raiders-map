import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Share2, Lock, Check, X } from 'lucide-react';
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
    const longPressTimer = React.useRef(null);
    const isLongPress = React.useRef(false);

    // Position tooltip below for top-row skills (y < 30), otherwise above
    const tooltipPosition = skill.y < 30 ? 'top-full mt-3' : 'bottom-full mb-3';

    // 터치 이벤트 핸들러 (모바일 롱프레스 감지)
    const handleTouchStart = (e) => {
        if (isLocked) return;
        isLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            // 롱프레스: 레벨다운
            isLongPress.current = true;
            onRemove(skill.id);
            longPressTimer.current = null;
        }, 500); // 500ms 롱프레스
    };

    const handleTouchEnd = (e) => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        // If it was a long press, prevent the click event
        if (isLongPress.current) {
            e.preventDefault();
        }
    };

    const handleTouchMove = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleTouchCancel = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 hover:z-[100]"
            style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
        >
            {/* Skill Icon Circle */}
            <div
                className={`w-14 h-14 md:w-24 md:h-24 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 cursor-pointer select-none
                    ${isLocked
                        ? 'border-gray-700 bg-gray-900/50 text-gray-700'
                        : isActive
                            ? `border-${color} bg-gray-800 text-${color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`
                            : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-400'
                    }
                    ${isMaxed ? `bg-${color}/10 shadow-[0_0_10px_rgba(var(--color-${color}),0.3)]` : ''}
                `}
                onClick={(e) => {
                    // Click handles Level Up (Tap)
                    // If long press happened, preventDefault in onTouchEnd stops this
                    if (!isLocked) onAdd(skill.id);
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onRemove(skill.id);
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onTouchCancel={handleTouchCancel}
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

            {/* Counter Pill - Positioned Absolutely below the icon */}
            <div className={`absolute top-[85%] left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] md:text-sm font-bold border transition-colors whitespace-nowrap z-50 shadow-md
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
    const [selectedSkill, setSelectedSkill] = useState(null);
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

    // Close tooltip on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectedSkill && !event.target.closest('.mobile-tooltip') && !event.target.closest('.skill-node')) {
                setSelectedSkill(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedSkill]);

    return (
        <div className="flex-1 relative h-full bg-[#0a0a0a] overflow-hidden flex flex-col text-white">
            {/* Top Navigation Bar */}
            <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 bg-gray-900/50 backdrop-blur-sm z-30 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-yellow-500">스킬 트리</h1>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="text-sm">
                        <span className="text-gray-400 hidden md:inline">사용된 스킬 포인트: </span>
                        <span className="text-gray-400 md:hidden">P: </span>
                        <span className="text-yellow-500 font-bold text-lg">{points.total}</span>
                    </div>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors border border-gray-700"
                    >
                        <RotateCcw size={14} />
                        <span className="hidden md:inline">초기화</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all font-bold ${isCopied
                            ? 'bg-green-600 text-white hover:bg-green-500'
                            : 'bg-yellow-600 text-black hover:bg-yellow-500'
                            }`}
                    >
                        {isCopied ? <Check size={14} /> : <Share2 size={14} />}
                        <span className="hidden md:inline">{isCopied ? '복사됨!' : '공유'}</span>
                    </button>
                </div>
            </div>

            {/* Main Scrollable Container */}
            <div
                ref={(el) => {
                    // Auto-scroll to center on mount for mobile
                    if (el && window.innerWidth < 768 && !el.hasScrolled) {
                        el.scrollLeft = (1280 - window.innerWidth) / 2;
                        el.hasScrolled = true;
                    }
                }}
                className="flex-1 relative w-full h-full overflow-y-auto overflow-x-auto bg-[#0a0a0a] custom-scrollbar flex flex-col items-start justify-start"
            >
                {/* Content Wrapper */}
                <div className="relative w-[1280px] h-[1600px] md:w-full md:min-w-[1200px] md:h-auto md:min-h-[1400px]">

                    {/* Header / Points Display (Inside Scrollable Area) */}
                    <div className="absolute top-4 left-0 right-0 h-20 z-20 pointer-events-none w-full">
                        <div className="absolute left-[25%] -translate-x-1/2 text-center w-1/3">
                            <h2 className="text-green-500 font-bold text-4xl drop-shadow-lg">{SKILL_DATA.conditioning.label}</h2>
                            <p className="text-green-400/80 text-sm font-mono">{points.conditioning} 포인트</p>
                        </div>
                        <div className="absolute left-[50%] -translate-x-1/2 text-center w-1/3">
                            <h2 className="text-yellow-500 font-bold text-4xl drop-shadow-lg">{SKILL_DATA.mobility.label}</h2>
                            <p className="text-yellow-400/80 text-sm font-mono">{points.mobility} 포인트</p>
                        </div>
                        <div className="absolute left-[75%] -translate-x-1/2 text-center w-1/3">
                            <h2 className="text-red-500 font-bold text-4xl drop-shadow-lg">{SKILL_DATA.survival.label}</h2>
                            <p className="text-red-400/80 text-sm font-mono">{points.survival} 포인트</p>
                        </div>
                    </div>

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
                    <div className="absolute inset-0 w-full h-full">
                        {allSkills.map(skill => {
                            const totalPoints = points[skill.category];
                            const isPointsLocked = skill.reqPoints > totalPoints;
                            const isPrereqLocked = skill.prerequisites && skill.prerequisites.length > 0 &&
                                !skill.prerequisites.some(pid => skillsState[pid] > 0);
                            const isLocked = isPointsLocked || isPrereqLocked;

                            return (
                                <div key={skill.id} className="skill-node">
                                    <SkillNode
                                        skill={skill}
                                        currentLevel={skillsState[skill.id] || 0}
                                        isLocked={isLocked}
                                        isPrereqLocked={isPrereqLocked}
                                        color={skill.category === 'conditioning' ? 'green-500' : skill.category === 'mobility' ? 'yellow-500' : 'red-500'}
                                        onAdd={(id) => {
                                            if (window.innerWidth < 768) {
                                                // 모바일: 레벨업 수행
                                                if (skillsState[id] < skill.maxLevel) {
                                                    handleSkillChange(id, (skillsState[id] || 0) + 1);
                                                }
                                                // 동시에 툴팁 표시
                                                const el = document.getElementById(`skill-node-${skill.id}`);
                                                if (el) {
                                                    const rect = el.getBoundingClientRect();
                                                    setSelectedSkill({
                                                        skill,
                                                        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
                                                    });
                                                }
                                            } else {
                                                if (skillsState[id] >= skill.maxLevel) return;
                                                handleSkillChange(id, (skillsState[id] || 0) + 1);
                                            }
                                        }}
                                        onRemove={(id) => {
                                            if (window.innerWidth < 768) {
                                                // 모바일: 레벨다운 수행
                                                if (skillsState[id] && skillsState[id] > 0) {
                                                    handleSkillChange(id, skillsState[id] - 1);
                                                }
                                                // 동시에 툴팁 표시
                                                const el = document.getElementById(`skill-node-${skill.id}`);
                                                if (el) {
                                                    const rect = el.getBoundingClientRect();
                                                    setSelectedSkill({
                                                        skill,
                                                        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
                                                    });
                                                }
                                            } else {
                                                if (!skillsState[id] || skillsState[id] <= 0) return;
                                                handleSkillChange(id, skillsState[id] - 1);
                                            }
                                        }}
                                    />
                                    {/* ID for position calculation */}
                                    <div id={`skill-node-${skill.id}`} className="absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: `${skill.x}%`, top: `${skill.y}%` }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile Tooltip (Dynamic Position) */}
            {selectedSkill && (
                <MobileTooltip
                    skill={selectedSkill.skill}
                    rect={selectedSkill.rect}
                    currentLevel={skillsState[selectedSkill.skill.id] || 0}
                    onClose={() => setSelectedSkill(null)}
                />
            )}
        </div>
    );
};

// Mobile Tooltip Component
const MobileTooltip = ({ skill, rect, currentLevel, onClose }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = React.useRef(null);

    // 3초 후 자동 닫기
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    useEffect(() => {
        if (tooltipRef.current && rect) {
            const tooltip = tooltipRef.current;
            const { innerWidth, innerHeight } = window;
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;

            let top = rect.top + rect.height + 10; // Default: below
            let left = rect.left + rect.width / 2 - tooltipWidth / 2; // Default: center

            // Check bottom edge
            if (top + tooltipHeight > innerHeight - 20) {
                top = rect.top - tooltipHeight - 10; // Move to top
            }

            // Check left/right edges
            if (left < 10) left = 10;
            if (left + tooltipWidth > innerWidth - 10) left = innerWidth - tooltipWidth - 10;

            setPosition({ top, left });
        }
    }, [rect]);

    const color = skill.category === 'conditioning' ? 'green-500' : skill.category === 'mobility' ? 'yellow-500' : 'red-500';

    return (
        <div
            ref={tooltipRef}
            className="mobile-tooltip fixed bg-gray-950 border border-gray-700 rounded-lg p-4 shadow-2xl z-[1000] w-72 animate-fade-in pointer-events-none"
            style={{ top: position.top, left: position.left }}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className={`font-bold text-base text-${color}`}>{skill.name}</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed whitespace-pre-wrap">{skill.description}</p>

            <div className="flex flex-col gap-2 border-t border-gray-800 pt-3">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Level: {currentLevel} / {skill.maxLevel}</span>
                    {skill.reqPoints > 0 && <span>Req: {skill.reqPoints} pts</span>}
                </div>
            </div>
        </div>
    );
};

export default SkillTreePage;
