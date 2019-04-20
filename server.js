const express = require('express')
const mongoose = require('mongoose')

/** routing 경로 */
const userRouter = require('./routes/api/userRouter');
const profileRouter = require('./routes/api/profileRouter');
const postRouter = require('./routes/api/postRouter');

const app = express();

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
mongoose.connect(db, { userNewUrlParser: true, userCreateIndex: true})
    .then( () => console.log('MongoDb Connected..'))
    .catch(err => console.log('err'));

    
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));