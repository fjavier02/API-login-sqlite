const database = require('../../database/connection')
const passport = require('passport');
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();

const llave = "Store-Book-Password"

const saltRounds = 10;
const myPassword = "Store-Book";
const myOtherPassword = "Other-Store-Book";


class Controller {

    //Users
    //Login API /api/login
    loginUser(){
        passport.authenticate('local',{
            //Recibir credenciales e iniciar sesión
            successRedirect: "/",
            failureRedirect: "/"
        });
    }
    loginFail(req, res){
        if(!req.user){
            res.send({login: req.isAuthenticated(), Fail: "Username or password invalid"})
        }else{
            res.redirect('/');
        }
    }

    //Sign-up API
    signUp(req,res) {
        const { username, email, password } = req.body;
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            if(err) console.log(err)
            let user = { 
                "username": req.body.username,
                "email": req.body.email,
                "password":  hash
            }
            //console.log(user)
        database.insert(user).into("users").asCallback(function(err, rows) {
            if (err) return console.error(err);  /* {
                if(err.error == 1062) {
                    console.log("User Duplicate")
                    res.json({"error": "User Duplicate"})
                }
            }else{
                return console.error(err);  
            }  */
            console.log("Record created successfully")
            res.json("Record created successfully")
        })
        });
        
    }
    resetPassword(req,res) {
        const { password } = req.body;
        const { user_id, name } = req.user;
        if(req.isAuthenticated()) {
            database("users").where({user_id: user_id, username : name}).update({password: password}).then(data => {
                if(data == 1){
                    console.log({"Recovery password successfully form user.user_id: ": user_id})
                    res.json("Recovery password successfully")
                }else{
                    console.log({"Recovery password fail form user.user_id: ": user_id})
                    res.json("incorrect data entered")
                }
            }).catch(err => {
                console.log(err)
                res.send(err)
            })
        }else{
            res.send("<h2>you must be logged in to change password</h2>")
        }
    }

}

module.exports = new Controller()