import { useState } from 'react';
import { SKILL_DATA } from '../data/skills';
import { Shield, Zap, Heart, Lock, Info } from 'lucide-react';

const SkillTreePage = () => {
    const [activeTab, setActiveTab] = useState('conditioning');
    const [selectedSkill, setSelectedSkill] = useState(null);

    const tabs = [
        { id: 'conditioning', label: '단련', icon: Shield, color: 'text-red-500', border: 'border-red-500/50' },
        { id: 'mobility', label: '이동성', icon: Zap, color: 'text-blue-500', border: 'border-blue-500/50' },
        { id: 'survival', label: '생존', icon: Heart, color: 'text-green-500', border: 'border-green-500/50' }
    ];

    return (
        <div className="flex-1 relative h-full bg-[#0a0a0a] flex flex-col overflow-hidden">
            {/* 헤더 */}
            <div className="h-16 border-b border-gray-800 bg-[#121212] flex items-center justify-between px-6 shrink-0">
                <h2 className="text-white font-bold text-xl flex items-center gap-2">
                    <span className="text-arc-accent">SKILL TREE</span> DATABASE
                </h2>
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gray-800 text-white border border-gray-600'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                                }`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? tab.color : ''} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex overflow-hidden">
                {/* 스킬 목록 (왼쪽) */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SKILL_DATA[activeTab].skills.map((skill) => (
                            <div
                                key={skill.id}
                                onClick={() => setSelectedSkill(skill)}
                                className={`bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 cursor-pointer transition-all hover:border-gray-600 hover:bg-[#222] group ${selectedSkill?.id === skill.id ? 'ring-1 ring-arc-accent border-arc-accent' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">
                                        {skill.name}
                                    </h3>
                                    {skill.requirement && (
                                        <Lock size={14} className="text-gray-600" />
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3 h-8">
                                    {skill.description}
                                </p>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="bg-gray-900 text-gray-400 px-2 py-1 rounded border border-gray-800">
                                        Cost: {skill.cost}
                                    </span>
                                    {skill.requirement && (
                                        <span className="text-orange-400 font-bold text-[10px]">
                                            조건부
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 스킬 상세 정보 (오른쪽 패널) */}
                <div className="w-80 bg-[#121212] border-l border-gray-800 p-6 flex flex-col shrink-0">
                    {selectedSkill ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-gray-900 border border-gray-700 ${activeTab === 'conditioning' ? 'text-red-500' :
                                    activeTab === 'mobility' ? 'text-blue-500' : 'text-green-500'
                                }`}>
                                {activeTab === 'conditioning' && <Shield size={24} />}
                                {activeTab === 'mobility' && <Zap size={24} />}
                                {activeTab === 'survival' && <Heart size={24} />}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">{selectedSkill.name}</h3>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-xs font-bold border border-gray-700">
                                    Cost: {selectedSkill.cost}
                                </span>
                                {selectedSkill.requirement && (
                                    <span className="bg-orange-900/30 text-orange-400 px-3 py-1 rounded text-xs font-bold border border-orange-900/50 flex items-center gap-1">
                                        <Lock size={12} />
                                        Locked
                                    </span>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Description</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedSkill.description}
                                    </p>
                                </div>

                                {selectedSkill.requirement && (
                                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                                        <h4 className="text-orange-400 text-xs font-bold uppercase mb-2 flex items-center gap-1">
                                            <Info size={12} />
                                            Requirement
                                        </h4>
                                        <p className="text-gray-400 text-xs">
                                            {selectedSkill.requirement}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-900/50 flex items-center justify-center mb-4">
                                <Info size={32} className="opacity-50" />
                            </div>
                            <p className="text-sm">Select a skill to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillTreePage;
