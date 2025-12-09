import React from 'react';
import { getRankIcon } from '../utils/rankUtils';

/**
 * LevelBadge Component
 * Displays the rank icon with the level number overlaid.
 * 
 * @param {Object} props
 * @param {number} props.level - User's level
 * @param {string} props.size - Size class for the icon (default: w-8 h-8)
 * @param {boolean} props.showLevel - Whether to show the level number text (default: true)
 */
const LevelBadge = ({ level = 1, size = "w-8 h-8", showLevel = true, className = "" }) => {
    // Extract width/height from potential Tailwind classes or define defaults for text sizing
    // This is a simple heuristic; for more control, pass text size explicitly or use relative units

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <img
                src={getRankIcon(level)}
                alt={`Lv.${level}`}
                className={`${size} object-contain drop-shadow-md`}
            />
            {showLevel && (
                <span
                    className="absolute inset-0 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs z-10"
                    style={{ textShadow: "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000" }}
                >
                    {level}
                </span>
            )}
        </div>
    );
};

export default LevelBadge;
