/*
import path from "path";
import fs from "fs";

import React from "react";

import ReactDOMServer from "react-dom/server";
import App from "../src/App";
*/

// mongodb+srv://anonkekker:V7VEjKE5LVtd1SzD@cluster0.wrkcxvc.mongodb.net/AdvNode?retryWrites=true&w=majority
//require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const mongoDB = require('./connect');
const { ObjectID } = require('mongodb');
const LocalStrategy = require('passport-local');

const app = express();


const DB_URI = "mongodb://localhost:27017/newUsers";
//"mongodb+srv://anonkekker:V7VEjKE5LVtd1SzD@cluster0.wrkcxvc.mongodb.net/AdvNode?retryWrites=true&w=majority";

app.use(cors());

app.use(session({
    secret: 'lilsecret',   //secret
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } /////
}));

app.use(passport.initialize());
app.use(passport.session());





////////////////////////////////////////////////////////
/*
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.route('/').get((req, res) => {
    res.send("TESTROUTE");
})


/*
app.use('/static', express.static(path.join(__dirname, '../NodeChat/client/public/')));
app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '../../NodeChat/client/public/')});
});
*/





mongoDB(async client => {
    const mDB = await client.db('newUsers').collection('users');

    /*
    
    app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
        const response = {  
            first_name:req.body.username,  
            last_name:req.body.password  
        };  
        console.log("DOES WURK!?!?");  
        res.sendStatus(200);
        res.end(JSON.stringify(response));  
    })
    */

    app.post('/login', passport.authenticate('local', {failureRedirect: '/' }), (req,res) => {
        console.log("INSIDE POST");
        const response = {  
            first_name:req.body.username,  
            last_name:req.body.password  
        };  
        res.sendStatus(200);
        res.end(JSON.stringify(response));  
    })
    



    passport.use(new LocalStrategy((username, password, done) => {
        console.log("aaaaaaaaaaaaaaaaaa");
        console.log(username);

        mDB.findOne({ name: username }
            
            , (err, user) => {
            console.log("INSIDE DB");
            console.log(`User ${username} attempted to log in.`);
            if (err) return done(err);
            if (!user) return done(null, false);
            if (password !== user.password) return done(null, false);
            return done(null, user);
        }
        
        );
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        mDB.findOne({ _id: new ObjectID(id) }, (err, doc) => {
            done(null, null);
        });
    });

}).catch(e => {
    console.log(e);
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };

app.listen(8080, () => {
    console.log('server listening on port 8080')
})