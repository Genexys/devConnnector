const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

//@route POST api/posts
//@desc Create a post
//@access Privet

router.post('/', [
        auth,
        [check('text', 'text is required').not().not().isEmpty()],

    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();

            res.json(post);

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
});

//@route GET api/posts
//@desc get all posts
//@access Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });

        res.json(posts);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/posts/:id
//@desc get post by id
//@access Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) res.status(404).json({ msg: 'Post not found'});

        res.json(post);

    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found'});
        } else {
            return res.status(500).send('Server Error');
        }
    }
});

//@route DELETE api/posts/:id
//@desc DELETE post by id
//@access Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) res.status(404).json({ msg: 'Post not found'});

        //Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await  post.remove();

        res.json({msg: 'Post removed'});

    } catch (err) {

        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found'});
        } else {
            return res.status(500).send('Server Error');
        }
    }
});

//@route PUT api/posts/like/:id
//@desc Like a post
//@access Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post alredy liked'});
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

//@route PUT api/posts/unlike/:id
//@desc unlike a post
//@access Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not been liked'});
        }

        // Get remove index
        post.likes = post.likes.filter(item => item.user.toString() !== req.user.id);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});


//@route POST api/posts/comment/:id
//@desc Comment on a post
//@access Privet

router.post('/comment/:id', [
        auth,
        [check('text', 'text is required').not().not().isEmpty()],

    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            // console.log(post)

            post.comments.unshift(newComment);

             await post.save();

            res.json(post.comments);

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
});

//@route DELETE api/posts/comment/:id/:comment_id
//@desc delete comment on a post
//@access Privet

router.delete('/comment/:id/:comment_id', auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            // pull out comment
            const comment = post.comments.find(itemComment => itemComment.id === req.params.comment_id);

            // Make sure comment exists
            if(!comment) {
                return res.status(404).json({ msg: 'Comment does not exist'});
            }

            //Check user
            if (comment.user.toString() !== req.user.id) {
                return res.status(404).json({ msg: 'User not authorized'});
            }

            post.comments = post.comments.find(itemComment => itemComment.id !== comment.id);

            await post.save();

            res.json(post.comments);

        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;