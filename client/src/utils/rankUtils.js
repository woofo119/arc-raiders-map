export const getRankIcon = (level) => {
    if (level >= 41) return '/ranks/rank_yellow.png';
    if (level >= 31) return '/ranks/rank_pink.png';
    if (level >= 21) return '/ranks/rank_blue.png';
    if (level >= 11) return '/ranks/rank_green.png';
    return '/ranks/rank_grey.png'; // 1-10
};
