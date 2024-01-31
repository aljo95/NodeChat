
const path = require('path');
const express = require('express');
const passport = require('passport');
const User = require('./models.js');
const controllers = require('./controllers.js');
const connectDB = require('./db.js');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');


const app = express();
connectDB();
dotenv.config({ path: './.env' });
const http = require('http').Server(app);


const corsOptions = {
    origin: process.env.FRONT_ORIGIN,
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionSuccessStatus: 200,
    credentials: true,
}


app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // for pre-flight
// app.set('trust proxy', 1);


app.use(cookieParser());


const sessionMiddleware = session({
    secret: process.env.STORE_SECRET,   // secret
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        sameSite: 'lax',
        httpOnly: false,
        maxAge: (24 * 7 * 60 * 60 * 1000)   // one week atm
    }
})


app.use(sessionMiddleware);


const io = require('socket.io')(http, {
    cors: {
        transports: ['websocket'],
        origin: process.env.FRONT_ORIGIN,
        credentials: true,
    }   
});


io.engine.use(sessionMiddleware);


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


// Use the route '/api/' 
app.use("/api/", controllers);


app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/../client/public/index.html'));
});

http.listen(process.env.PORT_NMBR, () => {
    console.log(`Server listening on ${process.env.PORT_NMBR}`);
});
