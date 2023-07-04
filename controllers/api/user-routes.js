const router = require('express').Router();
const { Post, User, Comment } = require('../../models');

// GET all users
router.get('/', async (req, res) => {
    try{
        const userData = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(userData)
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single user
router.get('/:id', async (req, res) => {
    try{
        const singleUser = await User.findOne(req.params.id, {
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'content', 'created_at'],
                }, 
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'created_at'],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                }
            ]
        });

        singleUser 
        ? res.status(200).json(singleUser) 
        : res.status(404).json({ message: 'No user found with this id!' });

    } catch (err) {
        res.status(500).json(err);
    }
});

// POST a new user
router.post('/', withAuth, async (req, res) => {
    try{
        const createUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            twitter: req.body.twitter,
            github: req.body.github,
        });

        req.session.save(() => {
            req.session.user_id = createUser.id;
            req.session.username = createUser.username;
            req.session.loggedIn = true;

            res.status(200).json(createUser);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', withAuth, async (req, res) => {
    try{
        const userLogin = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        userLogin
        ? res.status(200).json(userLogin)
        : res.status(400).json({ message: 'No user with that email address!' });

        const validPassword = await userLogin.checkPassword(req.body.password);


        validPassword
        ? res.status(200).json(validPassword)
        : res.status(400).json({ message: 'Incorrect password!' });


        req.session.save(() => {
            req.session.user_id = userLogin.id;
            req.session.username = userLogin.username;
            req.session.loggedIn = true;

            res.json({ user: userLogin, message: 'You are now logged in!' });
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/logout', withAuth, async (req, res) => {
    try{
        if (req.session.loggedIn) {
            req.session.destroy(() => {
                res.status(204).end();
            });
        } else {
            res.status(404).end();
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;