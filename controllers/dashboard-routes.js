const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth ,async (req, res) => {
    try{
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'created_at',
                'post_content'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username', 'twitter', 'github']
                    }
                },
                {
                    model: User,
                    attributes: ['username', 'twitter', 'github']
                }
            ]
        })

        const posts = postData.map((post) => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: true });

    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try{
        const singlePost = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'created_at',
                'post_content'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username', 'twitter', 'github']
                    }
                }, 
                {
                    model: User,
                    attributes: ['username', 'twitter', 'github']
                }
            ]
        });

        if(!singlePost){
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        // Serialize the data
        const post = singlePost.get({ plain: true });

        // Pass data to template
        res.render('edit-post', { post, loggedIn: true });

    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/create', withAuth, async (req, res) => {
    try{
        const getNewPost = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'created_at',
                'post_content'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username', 'twitter', 'github']
                    }
                },
                {
                    model: User,
                    attributes: ['username', 'twitter', 'github']
                }
            ]
        });

        // Serialize the data
        const posts = getNewPost.map((post) => post.get({ plain: true }));
        
        // Pass data to template
        res.render('create-post', { posts, loggedIn: true });

    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;