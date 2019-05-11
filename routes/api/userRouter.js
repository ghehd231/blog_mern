const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//jwt 변수
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//passport
const passport = require('passport');
const authCheck = passport.authenticate('jwt', {session: false});

const userModel = require('../../models/userModel');

//validator
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

/**
 * @route   POST api/user/register
 * @desc    Register user
 * @access  Public
 */
router.post('/register', (req, res) => {
    //validate
    const {errors, isValid} = validateRegisterInput(req.body);
    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    userModel
        .findOne({email: req.body.email})
        .then(user => {
            if(user){
                /*return res.status(400).json({
                    msg: 'Email already exists'
                });
                */
               errors.email = 'Email already exists';
               return res.status(400).json(errors);
            }else{
                // Create avatar
                // http://www.gravatar.com/avatar/56a0311c22d8e7b6d152ca6b90aa2e46?s=200&r=pg&d=mm 대충 이런식으로 주소가 만들어짐.
                // 위의 주소가 DB에 들어감
                const avatar = gravatar.url(req.body.email, {
                    s: '200',   // size
                    r: 'pg',    // Rating
                    d: 'mm'     // Default
                });

                // Create User
                const newUser = new userModel({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                // 암호화
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err; // 암호화 실패하면 에러던짐
                        newUser.password = hash; // 성공하면 비밀번호에 해쉬값 넣음
                        newUser.save() // 저장
                            .then(user => res.json(user))
                            .catch(err => res.json(err));
                    });
                });
            }
        })
        .catch(err => res.json(err))
});

/**
 * @route   POST api/user/login
 * @desc    Login user / returning JWT (https://velopert/com/2389)
 * @access  Public
 */
router.post('/login', (req, res) =>{
    const { email, password } = req.body;

    //validate
    const {errors, isValid} = validateLoginInput(req.body);
    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    //Find user by email
    userModel.findOne({email})
        .then(user => {
            if(!user){ //존재 x
               /* return res.status(404).json({
                    msg: "User Not Found"
                });
                */
               errors.email = 'user not found ';
               return res.status(400).json(errors);

            }else{ //존재 0
                bcrypt
                    .compare(password, user.password) //bcriypt 함수 입력한 값이랑 db에 등록되어 있는 hash 값
                    .then(isMatch =>{
                        if(isMatch){//일치 한다면
                            //res.json({msg: 'Sucess'})

                            //jwt start
                            const payload = {id: user, name: user.name, avatar: user.avatar};

                            //Sign Token
                            jwt.sign(
                                payload,
                                keys.secretOrKey,
                                {expiresIn: 3600},
                                (err,token) => {
                                    res.json({
                                        success: true,
                                        token: 'Bearer ' + token// bearer 는 헤더에 넣어주는 건데, 다른거 넣어도 됌 
                                    })
                                }
                            )

                        }else{
                            /*return res.status(404).json({
                                msg: "password incorreted"
                            });*/
                            errors.email = 'password incorreted';
                            return res.status(400).json(errors);
                        }
                    })
            }
        })
        .catch(err => res.json(err))
})


/**
 * @route   GET api/user/current
 * @desc    return current user
 * @access  private
 */
router.get(
    '/current',//경로
    authCheck,
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
)
/**
 * @route   GET api/user/test
 * @desc    Test user route
 * @access  Public
 */
router.get('/test', (req, res) => res.json({msg: 'userRouter Works'}));

module.exports = router;
