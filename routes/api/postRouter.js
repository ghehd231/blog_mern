const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const postModle = require('../../models/postModel');

//validation
const validatePostInput = require('../../validation/post');

//auth
const authCheck = passport.authenticate('jwt', {session: false});


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