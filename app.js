//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption"); //removed to use md5
// const md5 = require("md5"); //md5 -> hashing security // removed to use bcrypt
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const app = express();



//console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb://0.0.0.0:27017/userDB");

/* const userSchema = {
    email: String,
    password: String
}; */

const userSchema = new mongoose.Schema ({   //Object created from Mongoose.Schema class
    email: String, 
    password: String
});


// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){

    res.render("home");
});

app.get("/login", function(req,res){

    res.render("login");
});

app.get("/register", function(req,res){

    res.render("register");
});


app.post("/register", function(req,res){

    bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            // password: md5(req.body.password)    //md5 -> hashing security
            password: hash
        });
    
        newUser.save(function(err){
            if(err){
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });

   
});

app.post("/login", function(req, res){
    const username = req.body.username;
   // const password = md5(req.body.password);  //md5 -> hashing security
   const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                //if(foundUser.password === password){
                    bcrypt.compare(password, foundUser.password, function(err, result) {
                     if(result === true){
                        res.render("secrets");
                     }
                    });
                 //   
                //}
            }
        }
    });
});














app.listen(3000, function(){
    console.log("Server started on port 3000");
});