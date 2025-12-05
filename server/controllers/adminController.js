import Post from '../models/Post.js';
import User from '../models/User.js';
import Blacklist from '../models/Blacklist.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const pageSize = 20;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword
            ? {
                $or: [
                    { nickname: { $regex: req.query.keyword, $options: 'i' } },
                    { email: { $regex: req.query.keyword, $options: 'i' } },
                ],
            }
            : {};

        const count = await User.countDocuments({ ...keyword });
        const users = await User.find({ ...keyword })
            .select('-password')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ users, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user details (history, activity)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 최근 게시글 (5개)
        const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 }).limit(5);

        res.json({ user, posts });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
export const toggleBanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Prevent banning self
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: '자기 자신을 밴할 수 없습니다.' });
            }

            user.isBanned = !user.isBanned;
            await user.save();
            res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'}`, isBanned: user.isBanned });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get blacklist
// @route   GET /api/admin/blacklist
// @access  Private/Admin
export const getBlacklist = async (req, res) => {
    try {
        const blacklist = await Blacklist.find({}).sort({ createdAt: -1 }).populate('createdBy', 'nickname');
        res.json(blacklist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add to blacklist
// @route   POST /api/admin/blacklist
// @access  Private/Admin
export const addToBlacklist = async (req, res) => {
    const { ip, reason } = req.body;

    try {
        const exists = await Blacklist.findOne({ ip });
        if (exists) {
            return res.status(400).json({ message: '이미 블랙리스트에 존재하는 IP입니다.' });
        }

        const blacklistEntry = await Blacklist.create({
            ip,
            reason,
            createdBy: req.user._id
        });

        res.status(201).json(blacklistEntry);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Remove from blacklist
// @route   DELETE /api/admin/blacklist/:ip
// @access  Private/Admin
export const removeFromBlacklist = async (req, res) => {
    try {
        // IP can contain dots, so we might need to be careful with params, but usually fine.
        // Alternatively pass ID. Let's try passing ID for deletion as it's safer.
        // Wait, the plan said remove by IP? ID is better.
        // Let's support ID.
        const entry = await Blacklist.findById(req.params.id);

        if (entry) {
            await entry.deleteOne();
            res.json({ message: 'IP removed from blacklist' });
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get visitor stats
// @route   GET /api/admin/stats
// @access  Private/Admin
import VisitorLog from '../models/VisitorLog.js';
export const getVisitorStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

        const todayCount = await VisitorLog.countDocuments({ date: today });
        const weeklyCount = await VisitorLog.countDocuments({ date: { $gte: sevenDaysAgoStr } });

        res.json({ today: todayCount, weekly: weeklyCount });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
