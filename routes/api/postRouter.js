const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const postModle = require('../../models/postModel');
const profileModle = require('../../models/profileModel');

//validation
const validatePostInput = require('../../validation/post');

//auth
const authCheck = passport.authenticate('jwt', {session: false});


/**
 * @route   GET api/post
 * @desc    Get post
 * @access  Public
 */
router.get("/", (req, res) => {
    postModle.find()
        .sort({date:-1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound: 'No posts found'}));
});


/**
 * @route   GET api/post
 * @desc    Get post
 * @access  Public
 */
router.get("/:id", (req, res) => {
    postModle.findById(rq.params.id)
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json(err));
});


/**
 * @route   Delete api/post/:id
 * @desc    Delete post by id
 * @access  Private
 */
router.delete("/:id", authCheck, (req, res) => {
    profileModle.findOne({user: req.user.id}).then(profile => {
        postModle.findById(req.params.id)
            .then(post => {
                //check for post owner
                if(post.user.toString() !== req.user.id){//로그인 한사람과 작성한 사람이 다르면 에러
                    return res.status(404).json({nopostsfound:'User not authorized'});
                }
                post.remove().then( () => res.json({success: true}));
            })
            .catch(err => res.status(404).json({nopostsfound: 'No posts found'}));
    });
       
});

/**
 * @route   GET api/post/test
 * @desc    Test Post route
 * @access  Public
 */
router.get('/test', (req, res) => res.json({msg: 'PostRouter Works'}));


/**
 * @route   Post api/post
 * @desc    Create route
 * @access  Private
 */
router.post("/",authCheck, (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);

    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const newPost = new postModle({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save()
        .then(post => res.json(post))
        .catch(err => res.status(400).json(err));

})
module.exports = router;