const database = require('../../database/connection');
const express = require("express")
const router = express.Router()
const Controller = require('../controllers/Controller')
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

const saltRounds = 10;
const myPassword = "Store-Book";
const myOtherPassword = "Other-Store-Book";

const llave = "Store-Book-Password"
router.use(cookieParser('secret'));
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

passport.deserializeUser(function(user_id, done) {
  database.select('user_id', 'username').table('users').where({user_id:user_id}).then(data => {
    done(null, data[0]);
  })
});
    
//login API
router.post('/api/login', passport.authenticate('local', {
    //Receive credentials and log in
    successRedirect: "/",
    failureRedirect: "/api/loginFail"
}))

router.get('/api/loginFail', Controller.loginFail)

//Sign-up API
router.post('/api/sign-up',Controller.signUp)
router.put('/api/sign-up/resetPassword',Controller.resetPassword)

//logout API
router.get('/api/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

//get list users
router.get('/list-users', (req,res)=>{
    database.select('user_id', 'username').table('users').then( data => {
        console.log(data)
        res.json(data)
    })
});

//is user login?
router.get('/is-login', (req,res,next)=>{
    if(req.isAuthenticated()) return next();
    //is not logined
    console.log("is not logined")
    // console.log({login: req.isAuthenticated(), user: req.user})
    res.send({login: req.isAuthenticated(), user: req.user})
    //res.send('<h1>Welcome to my eBook-Store!</h1> <br> <p>Please do it login</p> <br> <p>from login use "/api/login"</p>')
    },(req,res)=>{
        //is logined
        console.log("is logined")
        // console.log({login: req.isAuthenticated(), user: req.user})
        res.send({login: req.isAuthenticated(), user: req.user})
        //res.send("<h1>Welcome to my eBook-Store!</h1>")
    }
);

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password'}, function(username, password, done) {
    database("users").where({ username : username}).then(data =>  {
        if(data.length == 1){
            bcrypt.compare(password, data[0].password, function(err, result) {
                if(err)console.log(err);
                if(username === data[0].username && result === true){
                    console.log("login " + data[0].username);
                    return done(null,{user_id:data[0].user_id, name:data[0].username});
                    
                }else {
                    console.log("Username or password invalid")
                    return done(null, false, { message: 'Username or password invalid' });
                }
            });
            
        }else {
            console.log("Username or password invalid")
            return done(null, false, { message: 'Username or password invalid' });
        }
    }).catch(error=>{
        console.log(error)
    }) 

}));

module.exports = router
