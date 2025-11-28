import { useState } from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';

const SkillTreePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const SKILL_TREE_URL = 'https://arctracker.io/ko/skill-tree';

    return (
        <div className="flex-1 relative h-full bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-[#121212] border border-gray-800 rounded-2xl p-10 text-center shadow-2xl">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                    <ExternalLink size={40} className="text-arc-accent" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">
                    ARC Raiders <span className="text-arc-accent">Skill Tree</span>
                </h2>

                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    The interactive Skill Tree Builder is hosted on <span className="text-white font-bold">ArcTracker.io</span>.<br />
                    Please visit their website to plan your character build.
                </p>

                <a
                    href={SKILL_TREE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-arc-accent hover:bg-orange-600 text-white text-lg font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-900/20"
                >
                    Open Skill Tree Builder
                    <ExternalLink size={20} />
                </a>

                <p className="mt-8 text-xs text-gray-600">
                    This link will open in a new tab.
                </p>
            </div>
        </div>
    );
};

export default SkillTreePage;
