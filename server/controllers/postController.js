import Post from '../models/Post.js';

// @desc    모든 게시글 조회
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'nickname username level')
            .sort({ createdAt: -1 }); // 최신순 정렬
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: '게시글 목록을 불러오는데 실패했습니다.' });
    }
};

// @desc    게시글 상세 조회
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'nickname username level')
            .populate('comments.author', 'nickname username level'); // 댓글 작성자 정보도 함께 조회

        if (post) {
            // 조회수 증가
            post.views = post.views + 1;
            await post.save();
            res.json(post);
        } else {
            res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '게시글 조회 실패' });
    }
};

// @desc    게시글 작성
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    const { title, content, category, images } = req.body;

    try {
        const post = await Post.create({
            title,
            content,
            category: category || 'free',
            images: images || [],
            author: req.user._id
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: '게시글 작성 실패' });
    }
};

// @desc    게시글 삭제
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            // 작성자 또는 관리자만 삭제 가능
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
    const { title, content, category, images } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            // 작성자 또는 관리자만 수정 가능
            if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: '수정 권한이 없습니다.' });
            }

            post.title = title || post.title;
            post.content = content || post.content;
            if (category) post.category = category;
            if (images) post.images = images;

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
    const { content } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            const comment = {
                content,
                author: req.user._id
            };

            post.comments.push(comment);
            await post.save();

            // Populate author info for the new comment
            const updatedPost = await Post.findById(req.params.id)
                .populate('author', 'nickname username level')
                .populate('comments.author', 'nickname username level');

            res.status(201).json(updatedPost);
        } else {
            res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '댓글 작성 실패' });
    }
};

// @desc    댓글 삭제
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            const comment = post.comments.find(c => c._id.toString() === req.params.commentId);

            if (!comment) {
                return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
            }

            // 작성자 또는 관리자만 삭제 가능
            if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: '삭제 권한이 없습니다.' });
            }

            post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
            await post.save();

            const updatedPost = await Post.findById(req.params.id)
                .populate('author', 'nickname username level')
                .populate('comments.author', 'nickname username level');

            res.json(updatedPost);
        } else {
            res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '댓글 삭제 실패' });
    }
};

// @desc    게시글 좋아???��?
// @route   PUT /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            const alreadyLiked = post.likes.includes(req.user._id);

            if (alreadyLiked) {
                // 좋아??취소
                post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
            } else {
                // 좋아??추�?
                post.likes.push(req.user._id);
            }

            await post.save();
            
            // ?�데?�트??게시글 반환 (?�요???�보 populate)
             const updatedPost = await Post.findById(req.params.id)
                .populate('author', 'nickname username level')
                .populate('comments.author', 'nickname username level');

            res.json(updatedPost);
        } else {
            res.status(404).json({ message: '게시글??찾을 ???�습?�다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '좋아??처리 ?�패' });
    }
};
