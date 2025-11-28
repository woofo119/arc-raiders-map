import { useState } from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';

const SkillTreePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    import { useState } from 'react';
    import { AlertTriangle } from 'lucide-react';

    const SkillTreePage = () => {
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);

        const SKILL_TREE_URL = 'https://arctracker.io/ko/skill-tree';

        return (
            <div className="flex-1 relative h-full bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
                <div className="max-w-2xl w-full bg-[#121212] border border-gray-800 rounded-2xl p-10 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                        <AlertTriangle size={40} className="text-arc-accent" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">
                        ARC Raiders <span className="text-arc-accent">Skill Tree</span>
                    </h2>

                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Skill Tree system is currently under development.<br />
                        We are working hard to bring you the best experience.
                    </p>

                    <div className="inline-flex items-center gap-3 bg-gray-800 text-gray-400 text-lg font-bold py-4 px-8 rounded-xl cursor-not-allowed opacity-70">
                        Coming Soon
                    </div>
                </div>
            </div>
        );
    };

    export default SkillTreePage;
