const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all comments
router.get('/', async (req, res) => {
    try{
        const commentData = await Comment.findAll();
        res.status(200).json(commentData) 
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST a new comment
router.post('/', withAuth, async (req, res) => {
    try{
        if (req.session) {
            const newComment = await Comment.create({
                comment_text: req.body.comment_text,
                post_id: req.body.post_id,
                user_id: req.session.user_id,
            });
        };
        res.status(200).json(newComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a comment
router.delete('/:id', withAuth, async (req, res) => {
    try{
        const deleteComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            }
        });

        deleteComment 
        ? res.status(200).json(deleteComment) 
        : res.status(404).json({ message: 'No comment found with this id!' });
        
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;