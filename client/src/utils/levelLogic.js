export const LEVEL_THRESHOLDS = [
    { level: 1, minPoints: 0 },
    { level: 2, minPoints: 10 },
    { level: 3, minPoints: 30 },
    { level: 4, minPoints: 60 },
    { level: 5, minPoints: 100 },
    { level: 6, minPoints: 150 },
    { level: 7, minPoints: 250 },
    { level: 8, minPoints: 400 },
    { level: 9, minPoints: 650 },
    { level: 10, minPoints: 1000 },
    { level: 11, minPoints: 1500 },
    { level: 12, minPoints: 2000 },
    { level: 13, minPoints: 3000 },
    { level: 14, minPoints: 4000 },
    { level: 15, minPoints: 5000 },
    { level: 16, minPoints: 6000 },
    { level: 17, minPoints: 7000 },
    { level: 18, minPoints: 8000 },
    { level: 19, minPoints: 9000 },
    { level: 20, minPoints: 10000 },
    { level: 21, minPoints: 12000 },
    { level: 22, minPoints: 15000 },
    { level: 23, minPoints: 18000 },
    { level: 24, minPoints: 22000 },
    { level: 25, minPoints: 26000 },
    { level: 26, minPoints: 30000 },
    { level: 27, minPoints: 35000 },
    { level: 28, minPoints: 40000 },
    { level: 29, minPoints: 45000 },
    { level: 30, minPoints: 50000 },
    { level: 31, minPoints: 60000 },
    { level: 32, minPoints: 70000 },
    { level: 33, minPoints: 80000 },
    { level: 34, minPoints: 95000 },
    { level: 35, minPoints: 110000 },
    { level: 36, minPoints: 130000 },
    { level: 37, minPoints: 150000 },
    { level: 38, minPoints: 170000 },
    { level: 39, minPoints: 190000 },
    { level: 40, minPoints: 210000 },
    { level: 41, minPoints: 250000 },
    { level: 42, minPoints: 300000 },
    { level: 43, minPoints: 360000 },
    { level: 44, minPoints: 430000 },
    { level: 45, minPoints: 510000 },
    { level: 46, minPoints: 600000 },
    { level: 47, minPoints: 700000 },
    { level: 48, minPoints: 800000 },
    { level: 49, minPoints: 900000 },
    { level: 50, minPoints: 1000000 }
];

export const calculateLevelInfo = (currentPoints = 0) => {
    // Ensure points is a number
    const points = Number(currentPoints);

    // Find current level
    let currentLevel = 1;
    let currentThreshold = LEVEL_THRESHOLDS[0];
    let nextThreshold = LEVEL_THRESHOLDS[1];

    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (points >= LEVEL_THRESHOLDS[i].minPoints) {
            currentLevel = LEVEL_THRESHOLDS[i].level;
            currentThreshold = LEVEL_THRESHOLDS[i];
            nextThreshold = LEVEL_THRESHOLDS[i + 1];
            break;
        }
    }

    // Calculate progress
    if (!nextThreshold) {
        // Max level
        return {
            level: currentLevel,
            progress: 100,
            currentPoints: points,
            minPoints: currentThreshold.minPoints,
            nextPoints: points, // Or some indicator of max
            pointsToNext: 0
        };
    }

    const pointsInLevel = points - currentThreshold.minPoints;
    const levelRange = nextThreshold.minPoints - currentThreshold.minPoints;
    const progress = Math.min(100, Math.max(0, (pointsInLevel / levelRange) * 100));

    return {
        level: currentLevel,
        progress,
        currentPoints: points,
        minPoints: currentThreshold.minPoints,
        nextPoints: nextThreshold.minPoints,
        pointsToNext: nextThreshold.minPoints - points
    };
};
