const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all posts
router.get('/', async (req, res) => {
    try{
        const postData = await Post.findAll({
            attributes: ['id', 'title', 'content', 'created_at'],
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: [{
                    model: User,
                    attributes: ['username', 'twitter', 'github']
                }]
            }
        ]
        });
        res.status(200).json(postData)
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single post
router.get('/:id', async (req, res) => {
    try{
        const singlePost = await Post.findOne(req.params.id, {
            attributes: ['id', 'title', 'content', 'created_at'],
            where: {
                id: req.params.id,
            },
            include: [{
                model: User,
                attributes: ['username', 'twitter', 'github']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: [{
                    model: User,
                    attributes: ['username', 'twitter', 'github']
                }]
            }
        ]
        });

        singlePost 
        ? res.status(200).json(singlePost) 
        : res.status(404).json({ message: 'No post found with this id!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST a new post
router.post('/', withAuth, async (req, res) => {
    try{
        const newPost = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id,
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// PUT (update) a post
router.put('/:id', async (req, res) => {
    try{
        const updatePost = await Post.update({
            title: req.body.title,
            content: req.body.content,
        },
        {
            where: {
                id: req.params.id,
            }
        });

        updatePost
        ? res.status(200).json(updatePost)
        : res.status(404).json({ message: 'No post found with this id!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a post
router.delete('/:id', async (req, res) => {
    try{
        const deletePost = await Post.destroy({
            where: {
                id: req.params.id,
            }
        });

        deletePost
        ? res.status(200).json(deletePost)
        : res.status(404).json({ message: 'No post found with this id!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;