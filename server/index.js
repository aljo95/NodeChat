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


const cors = require('cors');


const FileStore = require('session-file-store')(session);


/*****************************************************************************************/
const app = express();
connectDB();
const http = require('http').Server(app);



/*****************************************************************************************/


const corsOptions = {
    origin: "http://127.0.0.1:3000", // allow the server to accept request from different origin
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionSuccessStatus: 200,
    credentials: true,
}
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)) // for pre-flight



    // app.set('trust proxy', 1);

/*
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true); // allows cookie to be sent
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, DELETE"); // you must specify the methods used with credentials. "*" will not work. 
    next();
});
*/




app.use(cookieParser());

const sessionMiddleware = session({
    //store: new FileStore(options),
    secret: 'sEshEcrEt',   //secret
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        sameSite: 'lax',
        httpOnly: false,
        maxAge: (4 * 60 * 60 * 1000) 
    }
})

app.use(sessionMiddleware);







/*****************************************************************************************/
const socketIO = require('socket.io')(http, {
    cors: {
        transports: ['websocket'],
        origin: 'http://127.0.0.1:3000',
        credentials: true,
    }   
});

socketIO.engine.use(sessionMiddleware);


const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

let userNames = [];
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    
    socket.on('getTime', () => {
        const date = new Date();
        let currentDay = weekday[date.getDay()];
        let currentTime = (date.toLocaleString()).slice(11, 16);
        let fullTimeDisplay = currentDay + " " + currentTime;
        socketIO.emit('getTime', fullTimeDisplay);
    })

    

    socket.on('sendMessage', async (message) => {

        const date = new Date();
        let currentDay = weekday[date.getDay()];
        let currentTime = (date.toLocaleString()).slice(11, 16);
        let fullTimeDisplay = currentDay + " " + currentTime;
        message.time = fullTimeDisplay;
        
        socketIO.emit('message', message);
        const sockets = await socketIO.fetchSockets();
        console.log("CONNECTED USERS: " + sockets.length);
    })


    // WHEN LOG OUT WE NEED TO REMOVE FROM userNames array with socket emit from front end!!
    socket.on("sendUsername", (username) => {

        if (!userNames.includes(username)) {
            userNames.push(username);
        }
        console.log("IN SERVER userNames ARRAY!");
        console.log(userNames);
        console.log("IN SERVER userNames ARRAY!");
        socketIO.emit('username', userNames);
    })

    socket.on("removeUser", (username) => {
        // Find index of username and remove it from array if it exists
        let index = userNames.indexOf(username);
        if (index !== -1) {
            userNames.splice(index, 1);
        }
        socket.emit("updatedUsers", userNames);
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
});
/*****************************************************************************************/


const options = {};




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



























function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };


/*
app.listen(8080, () => {
    console.log('server listening on port 8080')
})*/
http.listen(8080, () => {
    console.log(`Server listening on 8080`);
});