import User from '../models/User.js';

export const fixInactiveUserDates = async () => {
    console.log('[Maintenance] Starting check for inactive user date anomalies...');
    try {
        // Find users with visitCount <= 1 or missing
        const users = await User.find({
            $or: [
                { visitCount: { $lte: 1 } },
                { visitCount: { $exists: false } }
            ]
        });

        const oneDay = 24 * 60 * 60 * 1000;
        let fixedCount = 0;

        for (const user of users) {
            // Skip if dates are missing
            if (!user.lastActiveAt || !user.createdAt) continue;

            const diff = new Date(user.lastActiveAt).getTime() - new Date(user.createdAt).getTime();

            // If lastActiveAt is more than 1 day after createdAt, it's suspicious for a user with visitCount 1.
            // (Allowing 1 day buffer for timezone diffs or immediate login after creation)
            if (diff > oneDay) {
                console.log(`[Maintenance] Fixing ${user.nickname} (${user.username}): Active ${user.lastActiveAt} -> Reset to Created ${user.createdAt}`);
                user.lastActiveAt = user.createdAt;
                await user.save();
                fixedCount++;
            }
        }

        if (fixedCount > 0) {
            console.log(`[Maintenance] ✅ Fixed ${fixedCount} inactive users' dates.`);
        } else {
            console.log('[Maintenance] No anomalies found.');
        }
    } catch (error) {
        console.error('[Maintenance] ❌ Error fixing user dates:', error);
    }
};
