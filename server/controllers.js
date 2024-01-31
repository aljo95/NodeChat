//controllers.js 
const express = require("express"); 
const router = express.Router(); 
const User = require("./models"); 
const Messages = require("./messagesModel");
const passport = require("passport"); 
const bcrypt = require("bcrypt"); 
  
const app = express();

const bodyParser = require('body-parser');
  // support parsing of application/json type post data
app.use(bodyParser.json());
  // support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));



router.post('/register', async (req, res) => { 
    console.log(req.body); 
    const { username, password} = req.body; 
    if (username==="" || password==="") { 
        console.log("FILL BOTH FIELDS!")
        return res.status(403);
    } 
    try { 
        // Check if user already exists 
        const existingUser = await User.findOne({ username }); 
        if (existingUser) { 
            console.log("ERROR USERNAME ALREADY EXISTS");
            return res.status(409);
        } 
        // Hash the password before saving it to the database 
        const salt = await bcrypt.genSalt(15); 
        const hashedPassword = await bcrypt.hash(password, salt); 
  
        // Create and save the new user 
        const newUser = new User({ username, password: hashedPassword }); 
        await newUser.save(); 
        console.log("New user made added!");
        return res.status(200).json({ message: "success" });
    } catch (err) { 
        return res.status(500); //.json({ message: err.message }); 
    } 
}); 
  
// User login route 
router.post('/login', 
    passport.authenticate("local", { session: true }),
    async (req, res) => { 
        req.session.name = req.body.username;
        res.status(200).json({ message: "success" });
    }
); 

// Route for saving history
router.post('/storeMessage', async (req, res) => {

    // Will return 0 if there are no records!
    let amountOfRecords = await Messages.countDocuments();
    console.log("Amount of documents/records: " + amountOfRecords); 

    // Save 10 records (0-9), when reached that count delete 5 first, move 5-9 to 0-4, then add new
    // Change numbers to higher values if real usage of chat app!
    if (amountOfRecords >= 99) {
        //Remove 0-4
        console.log("Deleting records");
        await Messages.deleteMany({ msgNr: {$lte: 49} });
        //Update 5-9 with msgNr change to 0-4
        for (let i=0; i<49; i++) {
            await Messages.updateOne( { msgNr: i+50 }, { $set: { msgNr: i } } );
        }
        amountOfRecords = await Messages.countDocuments();
    }
    if (typeof req.body.message === "string") {     
        const newMsg = new Messages( { text: req.body.message, msgNr: amountOfRecords } );
        await newMsg.save(); 
    }
    else if (typeof req.body.message === "object") {
        req.body.message.msgNr = amountOfRecords;
        const newMsg = new Messages(req.body.message); 
        await newMsg.save(); 
    } 
    else {
        console.log("Could not save history - incompatible data type with model");
        return res.status(500).json({ message: "could not save to mongoDB" });
    }
    return res.status(200).json({ message: "success" });
});

// Route to fetch history and display on front end
router.get('/getHistory', async (req, res) => {

    let historyResponseArray = [];
    const fullHistory = await Messages.find();

    //Sort by msgNr property to ensure correctness
    fullHistory.sort((a, b) => a.msgNr - b.msgNr);

    console.log(fullHistory);

    for (let i=0; i<fullHistory.length; i++) {
        if (fullHistory[i].name) {
            let pushObj = { 
                name: fullHistory[i].name, 
                text: fullHistory[i].text,
                time: fullHistory[i].time,
            }
            historyResponseArray.push(pushObj);
        } else {
            // Just pushing the strong for react state format
            historyResponseArray.push(fullHistory[i].text);
        }
    }
    for (let i=0; i<historyResponseArray.length; i++) {
        if (historyResponseArray[i].name) {
            historyResponseArray = historyResponseArray.slice(i);
            break;
        }
    }
    // Correct res format for just array? Include message or status code?
    res.send(historyResponseArray);
});

// Checking if user is logged in or not
// Used for debugging
router.get('/checkAuth', (req, res) => {

    if (req.isAuthenticated()) {
        console.log("LOGGED IN!");
    } else {
        console.log("NOT LOGGED IN :(");
    }
    //console.log(req.session);
   res.send({ username: req.session.name } )
})

// Route on user logout 
router.get("/logout", (req, res) => { 
    req.session.destroy(); 
    res.status(200).json({ message: "logout success" }); 
}); 

module.exports = router;  
