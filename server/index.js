/*
import path from "path";
import fs from "fs";

import React from "react";

import ReactDOMServer from "react-dom/server";
import App from "../src/App";
*/

//require('dotenv').config();
const path = require('path');
const express = require('express');
const passport = require('passport');
const User = require('./models.js');
const LocalStrategy = require('./passp.js');
const controllers = require('./controllers.js');
//const cookieParser = require('cookie-parser');  ////////////////
const connectDB = require('./db');
const bodyParser = require('body-parser');
const routes = require('./pages.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const FileStore = require('session-file-store')(session);

//const cors = require('cors');

const app = express();
connectDB();


/*
const corsOptions = {
    //origin: "http://127.0.0.1:3000", // allow to server to accept request from different origin
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionSuccessStatus: 200,
    credentials: true,
}
app.options('*', cors(corsOptions)) // for pre-flight
app.use(cors(corsOptions));


*/
app.set('trust proxy', 1);


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true); // allows cookie to be sent
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, DELETE"); // you must specify the methods used with credentials. "*" will not work. 
    next();
});





const options = {};



app.use(cookieParser());
app.use(session({
    //store: new FileStore(options),
    secret: 'sEshEcrEt',   //secret
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        sameSite: 'none',
        httpOnly: false,
        maxAge: (4 * 60 * 60 * 1000) 
    }
}));

//app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser( async (id, done) => {

    try {
        const userFound = await User.findById(id);
        done(null, userFound);
    } catch(err) {
        console.log(err);
    }

});
/*
passport.deserializeUser( async (id, done) => {

    await User.findById(id, (err, user) => done(err, user));
    
});
*/

app.set('view engine', 'ejs')

// Use the routes 
app.use("/api/", controllers); // Path to your authentication routes file 
app.use("/", routes); 


app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/../client/public/index.html'));
})


//__dirname, '/../client/public/index.html'

/*
app.route('/').get((req, res) => {
    res.send("TESTROUTE");
})
/*
app.post('/register', (req, res) => {
    console.log("POSTEDEDED");
})
*/











































/*
mongoDB(async client => {
    const mDB = await client.db('newUsers').collection('users');

    
    /*
    app.route('/login').post((req, res) => {
        const response = {  
            first_name:req.body.username,  
            last_name:req.body.password  
        };  
        mDB.insertOne(response);
        console.log("DOES WURK!?!?");  
        res.sendStatus(200);
        res.end(JSON.stringify(response));  
    })
    
/*
    app.post('/login', passport.authenticate('local', {failureRedirect: '/' }), (req,res) => {
        console.log("INSIDE POST");
        const response = {  
            first_name:req.body.username,  
            last_name:req.body.password  
        };  
        res.sendStatus(200);
        res.end(JSON.stringify(response));  
    })
    */

/*

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
})*/




function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };



app.listen(8080, () => {
    console.log('server listening on port 8080')
})