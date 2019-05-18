const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');
const validateEducationInput = require('../../validation/education');
const validateExperienceInput = require('../../validation/experience');

const profileModel = require('../../models/profileModel');
const userModel = require('../../models/userModel');

const authCheck = passport.authenticate('jwt', {session: false});

router.get('/test', (req, res) => res.json({msg: 'Profile Works'}));

/**
 * @route   GET api/profile
 * @desc    Get current users profile
 * @access  Private
 */
router.get('/', authCheck, (req, res) => {
    const errors = {};

    profileModel.findOne({user: req.user.id})
        .populate('user',['name','avatar'])// name, avatar 를 기준으로 불러옴 ? 권한 설정?
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.json(err));
});

/**
 * @route   GET api/profile/all
 * @desc    Get all profiles
 * @access  Public
 */
router.get('/all', (req, res) =>{
    const errors = {};

    profileModel.find()
        .populate('user', ['name', 'avatar'])//어떤 정보를 불러올꺼나..근데 name, avatar를 기준으로 불러옴. RDB에서 WHERE이랑 비슷한 개념
        .then(profile => { 
            if(!profile){
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({
            profile : "There are no profiles" //프로필 정보가 없을때
        }));
});

/**
 * @route   GET api/profile/handle/:handle
 * @desc    Get profile by handle
 * @access  Public
 */
router.get('/handle/:handle', (req, res) => {
    const errors = {};

    profileModel.find({handle: req.params.handle})//지금은 정확히 일치하는 것만 찾음 
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

/**
 * @route   GET api/profile/user/:user_id
 * @desc    Get profile by user_id
 * @access  Public
 */
router.get('/user/:user_id', (res, req) =>{
    const errors = {};

    profileModel.findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


/**
 * @route   POST api/profile
 * @desc    Create or edit user profile
 * @access  Private
 */
router.post('/', authCheck, (req, res) => {
    
    // validate
    const {errors, isValid} = validateProfileInput(req.body);

    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills - Snilt into array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    profileModel.findOne({user: req.user.id})
        .then(profile => {

            if(profile){ // 이미 존재한다면 update
                profileModel
                    .findOneAndUpdate(
                        {user: req.user.id},
                        {$set: profileFields},
                        {new: true}
                    )
                    .then(profile => res.json(profile))
                    .catch(err => res.json(err));

            }else{ // 없다면 insert
                // check if handle exists
                profileModel
                    .findOne({handle: profileFields.handle})
                    .then(profile => {
                        if(profile){
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }
                        new profileModel(profileFields)
                            .save()
                            .then(profile => res.json(profile))
                            .catch(err => res.json(err));
                    })
                    .catch(err => res.json(err));
            }

        })
        .catch(err => res.json(err));

});


/**
 * @route   GET api/profile/experience
 * @desc    Get experience by profile
 * @access  Private
 */
router.post('/experience', authCheck, (req, res) =>{ //authCheck 는 로그인했는지 검사해서 값가져오는 거
    const {errors, isValid} = validateExperienceInput(req.body);

    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    profileModel.findOne({user: req.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            /*add to exp array
            profileModel.experience.shift(newExp); //배열을 차곡차곡 순서대로 저장
            profileModel
                .save()
                .then(profile => res.json(profile))
                .catch(err => res.status(400).json(err));
            */
           //검색결과로 뽑아낸 profile 의 experience 의 값 수정
           profile.experience = profile.experience.unshift(newExp); // 새로운값 + 기존값 (축적)
           const updateProfile = new profileModel(profile);
            

           updateProfile
               .save()
               .then(profile => {
                   res.json(profile);
               })
               .catch(err => {
                   res.status(404).json(err);
               });
        })
        .catch(err => res.status(404).json(err));

})

/**
 * @route   GET api/profile/Education
 * @desc    Get Education by profile
 * @access  Private
 */
router.post('/education', authCheck, (req, res) =>{ //authCheck 는 로그인했는지 검사해서 값가져오는 거
    const {errors, isValid} = validateEducationInput(req.body);

    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    profileModel.findOne({user: req.user.id})
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

           profile.education = profile.education.unshift(newEdu); // 새로운값 + 기존값 (축적)
           const updateProfile = new profileModel(profile);
            
           updateProfile
               .save()
               .then(profile => {
                   res.json(profile);
               })
               .catch(err => {
                   res.status(404).json(err);
               });
        })
        .catch(err => res.status(404).json(err));

})

/**
 * @route   Delete api/profile/experience/ :exp_id
 * @desc    Delete experience from profile
 * @access  Private
 */
router.delete("/experience/:exp_id", authCheck, (req, res) => {

    profileModel.findOne({user: req.user.id})
            .then(profile => {
                // get remove index
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.exp_id);
                    
                // splice out of array
                profile.experience.splice(removeIndex, 1);
                
                //save
                profile.save()
                    .then(
                        profile => res.json(profile))
                    .catch(err => {                        
                        res.status(404).json(err)
                    });
            })
            .catch(err => res.status(404).json(err));
        
});

/**
 * @route   Delete api/profile/education/:exp_id
 * @desc    Delete education from profile
 * @access  Private
 */
router.delete("/education/:edu_id", authCheck, (req, res) => {
    profileModel.findOne({user: req.user.id})
        .then(profile => {
            //get remove index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            // splice out of array
            profile.education.splice(removeIndex, 1);

            //save
            profile.save()
                .then(profile => res.json(profile))
                .catch(err => res.status(404).json(err));
        })
        .catch(err => res.status(404).json(err));
});

/**
 * @route   Delete api/profile
 * @desc    Delete user and profile
 * @access  Private
 */
router.delete("/", authCheck, (req, res) =>{
    
    profileModel.findByIdAndRemove({user: req.user.id})
        .then(()=>{
            userModel.findOneAndRemove({ _id: req.user.id})
                .then( () => res.json({ success: true}))
                .catch( err => res.status(400).json(err));
        })
        .catch( err => {
            res.status(404).json(err);
        });
});
module.exports = router;