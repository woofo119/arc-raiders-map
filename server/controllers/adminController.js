import Post from '../models/Post.js';

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
        // Post 모델을 import 해야 함. 상단에 import 추가 필요.
        // 하지만 동적 import를 사용하거나, 상단에 추가해야 함.
        // 여기서는 상단에 추가하는 것이 좋음.
        // 일단 Post 모델이 없으므로 추가해야 함.

        // Post 모델 가져오기 (상단 import 추가 전제)
        // const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 }).limit(5);

        // 댓글은 Post 모델 내에 있거나 별도 모델일 수 있음.
        // 현재 구조상 Post 모델 내에 comments 배열이 있음.
        // 따라서 사용자가 작성한 댓글을 찾으려면 모든 Post를 검색하거나, 
        // Comment 모델이 분리되어 있지 않다면 찾기 어려움.
        // Post 스키마를 보면 comments 배열이 내장되어 있음.
        // { comments: [{ author: ObjectId, content: String, ... }] }
        // 이 경우 사용자가 쓴 댓글을 찾으려면 aggregate를 써야 함.

        res.json({ user });
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
