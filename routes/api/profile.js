const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//@route GET api/profile/me
//@desc Get current users profile
//@access Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id}).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user'})
        }

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route POST api/profile
//@desc Create or update user profile
//@access Private

router.post('/', [ auth, [
    check('status', 'status is required')
        .not()
        .isEmpty(),
    check('skills', 'Skills is required')
        .not()
        .isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            facebook,
            twitter,
            instagram,
            linkedin,
            youtube
        } = req.body;

        //build profile object
        const profileFields = {};

        profileFields.user = req.user.id;

        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build social object
        profileFields.social = {};

        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {

            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {

                //update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id},
                    {$set: profileFields},
                    {new: true}
                    );

                return  res.json(profile);
            }

            // Create
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
});

//@route GET api/profile
//@desc Get all profile
//@access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/profile/user/user_id
//@desc Get profile by user ID
//@access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'profile not found'});
        }

        res.json(profile);

    } catch (err) {
        console.error(err.message);

        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        } else {
            res.status(500).send('Server Error');
        }
    }
});

//@route DELETE api/profile
//@desc Delete profile, user & posts
//@access Private

router.delete('/', auth, async (req, res) => {
    try {
        // Remove user post
        await Post.deleteMany({ user: req.user.id });

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route PUT api/profile/experience
//@desc Add profile experience
//@access Private

router.put('/experience',
    [
        auth,
        [
            check('title', 'title is required')
                .not()
                .isEmpty(),
            check('company', 'company is required')
                .not()
                .isEmpty(),
            check('from', 'from date is required')
                .not()
                .isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };
        
        try {
            const profile = await Profile.findOne({ user: req.user.id});

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//@route DELETE api/profile/experience/:exp_id
//@desc Delete experience from profile
//@access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {

    try {
        // Remove experience profile
        const foundProfile = await Profile.findOne({ user: req.user.id });

        // get remove inx
        foundProfile.experience = foundProfile.experience.filter(exp => parseInt(exp._id) !== parseInt(req.params.exp_id));

        await foundProfile.save();

        return res.status(200).json(foundProfile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route PUT api/profile/education
//@desc Add profile education
//@access Private

router.put('/education',
    [
        auth,
        [
            check('school', 'school is required')
                .not()
                .isEmpty(),
            check('degree', 'degree is required')
                .not()
                .isEmpty(),
            check('fieldofstudy', 'Field of study is required')
                .not()
                .isEmpty(),
            check('from', 'from date is required')
                .not()
                .isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id});

            profile.education.unshift(newExp);

            await profile.save();

            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//@route DELETE api/profile/education/:edu_id
//@desc Delete education from profile
//@access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        // Remove profile
        const profile = await Profile.findOne({ user: req.user.id });

        // get remove inx
        profile.education = profile.education.filter(edu => parseInt(edu._id) !== parseInt(req.params.edu_id));

        profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route GET api/profile/github/:username
//@desc get user repos from gitgub
//@access Public

router.get('/github/:username', (req, res) => {
   try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js'}
        };

        request(options, (error, response, body) => {

            if (error) console.error(error.message);

            if (response.statusCode !== 200) res.status(400).json({ msg: 'No Gitgub profile found'});

            res.json(JSON.parse(body));
        });

   } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error');
   }
});


module.exports = router;