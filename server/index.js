const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
const {auth} = require('./middleware/auth');
const {User} = require("./models/User");


app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello new World!' ))

app.get('/api/hello', (req, res) => res.send('Hello World!~~~~'))

app.post('/api/users/register', (req, res) =>{
    //Put client info into database
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res)=>{
//finding requested loggin id in a database
User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
        return res.json({
            loginSuccess: false,
            message: "Cannot find a email!!"
        })
    }
    //if loggin info exist in a database check password
    user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch)
        return res.json({loginSuccess: false, message: "Password is incorrect!!!"})

     //generate token if password info and login info matched
        user.generateToken((err, user) => {
            //receive token and check
            if(err) return res.status(400).send(err);
            //save token into cookie.
            res.cookie('x_auth', user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id })
        })
    })
})
})


app.get('/api/users/auth', auth, (req,res) => {
    // passed until this point means Authentication is true, so...
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, 
        {token: ""}
        , (err, user) => {
            if(err) return res.json({ success: false, err});
            return res.status(200).send({ success: true})
        })
})




const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))