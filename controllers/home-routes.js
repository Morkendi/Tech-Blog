const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', async (req, res) => {
    try{
        const postData = await Post.findAll({
            attributes: [
                'id',
                'title',
                'created_at',
                'post_content'
            ],
            include: [{
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

    // Serialize data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass data to template
    res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn
    });

    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
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
        res.render('single-post', { post, loggedIn: req.session.loggedIn });

    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/login', async (req, res) => {
    try{
        if(req.session.loggedIn){
            res.redirect('/');
            return;
        }

        res.render('login');
    }catch(err){
        res.status(500).json(err);
    }
});

router.get('/signup', async (req, res) => {
    try{
        if(req.session.loggedIn){
            res.redirect('/');
            return;
        }

        res.render('signup');
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;