const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')// request.body 쓸수 있음


/** routing 경로 */
const userRouter = require('./routes/api/userRouter');
const profileRouter = require('./routes/api/profileRouter');
const postRouter = require('./routes/api/postRouter');

const app = express();


/**
 * @desc    body-parser setting
 * @access  Public
 */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/** use route */
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/post', postRouter);


/**
 * @database   mongoose
 * @desc    blog_mern 
 * @access  Public
 */
const db = require('./config/keys').mongoURI;
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true})
    .then( () => console.log('MongoDb Connected..'))
    .catch(err => console.log('err'));


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));