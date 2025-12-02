import Blacklist from '../models/Blacklist.js';

export const checkBlacklist = async (req, res, next) => {
    try {
        // Get IP address
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Normalize IP (handle IPv6 mapped IPv4)
        const normalizedIp = ip.replace(/^::ffff:/, '');

        const blacklisted = await Blacklist.findOne({ ip: normalizedIp });

        if (blacklisted) {
            return res.status(403).json({
                message: 'Access Denied: Your IP has been blacklisted.',
                reason: blacklisted.reason
            });
        }

        next();
    } catch (error) {
        console.error('Blacklist check error:', error);
        next(); // Fail open to avoid blocking legit users on error
    }
};
