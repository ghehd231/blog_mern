const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

const profileModel = require('../../models/profileModel');
const userModel = require('../../models/userModel');

const authCheck = passport.authenticate('jwt',{session: true});


/**
 * @route   GET api/profile
 * @desc    Get current users profile
 * @access  Private
 */

 router.get('/',authCheck, (req, res) => {
     const error = {};

     profileModel.findOne({user: req.user.id})
        .then(profile =>{
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            
            res.json(profile);
        })
        .catch(err => res.json(err));
 })
/**
 * @route   GET api/profile/test
 * @desc    Test Profile route
 * @access  Public
 */
router.get('/test', (req, res) => res.json({msg: 'profile Works'}));

module.exports = router;