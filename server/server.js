
//require('dotenv').config();
const path = require('path');
const express = require('express');
const passport = require('passport');
const User = require('./models.js');
const LocalStrategy = require('./passp.js');
const controllers = require('./controllers.js');
//const cookieParser = require('cookie-parser');  ////////////////
const connectDB = require('./db.js');
const bodyParser = require('body-parser');
const routes = require('./pages.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const cors = require('cors');

// Use different store later?
const FileStore = require('session-file-store')(session);


const app = express();
connectDB();
const http = require('http').Server(app);

const corsOptions = {
    //origin: "http://127.0.0.1:3000", // allow the server to accept request from different origin
    origin: "http://192.168.0.4:3000",
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionSuccessStatus: 200,
    credentials: true,
}
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // for pre-flight
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
    // store: new FileStore(options),
    secret: 'sEshEcrEt',   // secret
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
        origin: 'http://192.168.0.4:3000',
        credentials: true,
    }   
});

const socketIOExport = require('./socket.js')(io);
io.engine.use(sessionMiddleware);
//socketIOExport();

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
});

http.listen(8080, () => {
    console.log(`Server listening on 8080`);
});
