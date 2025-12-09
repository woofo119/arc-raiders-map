import React, { useMemo } from 'react';
import { calculateLevelInfo } from '../utils/levelLogic';

/**
 * ExperienceBar Component
 * Visualizes the user's progress towards the next level.
 * 
 * @param {Object} props
 * @param {number} props.points - Current points
 * @param {string} props.className - Additional classes
 */
const ExperienceBar = ({ points = 0, className = "" }) => {
    const { level, progress, minPoints, nextPoints, currentPoints } = useMemo(() => calculateLevelInfo(points), [points]);

    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Lv.{level}</span>
                <span>{Math.floor(progress)}%</span>
                <span>Lv.{level + 1}</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div
                    className="h-full bg-gradient-to-r from-arc-accent to-orange-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,100,0,0.5)]"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="text-right text-[10px] text-gray-500 mt-1 font-mono">
                {currentPoints.toLocaleString()} / {nextPoints ? nextPoints.toLocaleString() : 'MAX'} XP
            </div>
        </div>
    );
};

export default ExperienceBar;
