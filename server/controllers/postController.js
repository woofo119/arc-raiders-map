import Post from '../models/Post.js';
import User from '../models/User.js';
import { calculateLevel } from '../utils/levelUtils.js';

// Helper to update user points
const updatePoints = async (userId, amount) => {
    try {
        const user = await User.findById(userId);
        if (user) {
            user.points = (user.points || 0) + amount;

            // Recalculate level
            const newLevel = calculateLevel(user.points);
            if (newLevel !== user.level) {
                user.level = newLevel;
            }

            await user.save();
        }
    } catch (error) {
        console.error(`Failed to update points for user ${userId}:`, error);
    }
};

// @desc    모든 게시글 조회
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'nickname username level points')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: '게시글 목록 조회 실패' });
    }
};

// @desc    게시글 상세 조회
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'nickname username level points')
            .populate('comments.author', 'nickname username level points');

        if (post) {
            // 조회수 증가
            post.views = (post.views || 0) + 1;
            await post.save();
            res.json(post);
        } else {
            res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
};

// @desc    게시글 작성
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { title, content, category, images } = req.body;

        const post = new Post({
            title,
            content,
            category,
            images,
            author: req.user._id
        });

        const createdPost = await post.save();

        // 포인트 지급: 게시글 작성 +10
        await updatePoints(req.user._id, 10);

        res.status(201).json(createdPost);
    } catch (error) {
        res.status(400).json({ message: '게시글 작성 실패' });
    }
};

// @desc    게시글 삭제
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: '삭제 권한이 없습니다.' });
            }

            await post.deleteOne();
            res.json({ message: '게시글이 삭제되었습니다.' });
        } else {
            res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '게시글 삭제 실패' });
    }
};

// @desc    게시글 수정
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    try {
        const { title, content, category, images } = req.body;
        const post = await Post.findById(req.params.id);

        if (post) {
            if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: '수정 권한이 없습니다.' });
            }

            post.title = title || post.title;
            post.content = content || post.content;
            post.category = category || post.category;
            post.images = images || post.images;

            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '게시글 수정 실패' });
    }
};

// @desc    댓글 작성
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req, res) => {
    try {
        const { content, parentId } = req.body;
        const post = await Post.findById(req.params.id);

        if (post) {
            const comment = {
                content,
                author: req.user._id,
                parentId: parentId || null // 대댓글인 경우 부모 댓글 ID 저장
            };

            post.comments.push(comment);
            await post.save();

            // 포인트 지급: 댓글 작성 +5
            await updatePoints(req.user._id, 5);

            // Populate author info for the updated post
            await post.populate('content author', 'nickname username level points');
            await post.populate('comments.author', 'nickname username level points');

            res.status(201).json(post);
        } else {
            res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(400).json({ message: '댓글 작성 실패' });
    }
};

// @desc    댓글 삭제
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            const comment = post.comments.id(req.params.commentId);

            if (!comment) {
                return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
            }

            if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: '삭제 권한이 없습니다.' });
            }

            comment.deleteOne(); // Subdocument remove
            await post.save();
            res.json({ message: '댓글이 삭제되었습니다.' });
        } else {
            res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '댓글 삭제 실패' });
    }
};

// @desc    좋아요/비추천 토글 (게시글 및 댓글)
// @route   PUT /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
    try {
        // req.body: { action: 'like' | 'dislike', target: 'post' | 'comment', commentId: string }
        const { action = 'like', target = 'post', commentId } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        let targetObj = post;
        let authorId = post.author;
        let pointsLike = 5;
        let pointsDislike = 5; // 차감량

        if (target === 'comment') {
            if (!commentId) return res.status(400).json({ message: '댓글 ID가 필요합니다.' });
            targetObj = post.comments.id(commentId);
            if (!targetObj) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
            authorId = targetObj.author;
            pointsLike = 2; // 댓글 추천 포인트
            pointsDislike = 2; // 댓글 비추 포인트
        }

        const userId = req.user._id;

        // Ensure arrays exist
        if (!targetObj.likes) targetObj.likes = [];
        if (!targetObj.dislikes) targetObj.dislikes = [];

        const isLiked = targetObj.likes.includes(userId);
        const isDisliked = targetObj.dislikes.includes(userId);

        if (action === 'like') {
            if (isLiked) {
                // 이미 추천함 -> 추천 취소
                targetObj.likes.pull(userId);
                await updatePoints(authorId, -pointsLike); // 포인트 회수
            } else {
                // 추천하기
                if (isDisliked) {
                    // 비추천 상태였음 -> 비추천 취소 후 추천
                    targetObj.dislikes.pull(userId);
                    await updatePoints(authorId, pointsDislike); // 비추천 차감 복구
                }
                targetObj.likes.push(userId);
                await updatePoints(authorId, pointsLike); // 추천 포인트 지급
            }
        } else if (action === 'dislike') {
            if (isDisliked) {
                // 이미 비추천함 -> 비추천 취소
                targetObj.dislikes.pull(userId);
                await updatePoints(authorId, pointsDislike); // 차감 복구
            } else {
                // 비추천하기
                if (isLiked) {
                    // 추천 상태였음 -> 추천 취소 후 비추천
                    targetObj.likes.pull(userId);
                    await updatePoints(authorId, -pointsLike); // 추천 포인트 회수
                }
                targetObj.dislikes.push(userId);
                await updatePoints(authorId, -pointsDislike); // 비추천 포인트 차감
            }
        } else {
            return res.status(400).json({ message: '잘못된 액션입니다.' });
        }

        await post.save();
        res.json({
            likes: targetObj.likes,
            dislikes: targetObj.dislikes,
            target: target
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '처리 실패' });
    }
};
