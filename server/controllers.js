
//controllers.js 
const express = require("express"); 
const router = express.Router(); 
const User = require("./models"); 
const passport = require("passport"); 
const bcrypt = require("bcrypt"); 
  


///////////////////////////////// EXPERIMENTS
const app = express();

const bodyParser = require('body-parser');
  // support parsing of application/json type post data
  app.use(bodyParser.json());
  //support parsing of application/x-www-form-urlencoded post data
  app.use(bodyParser.urlencoded({ extended: true }));
// User registration route 

/*
router.post('/register', (req, res) => {
    console.log("POSTEDEDED");
})
////////////////////////////////////
*/






router.post('/register', async (req, res) => { 
    console.log(req.body); 
    const { username, password} = req.body; 
    if (username==="" || password==="") { 
        console.log("FILL BOTH!")
        return res 
            .status(403) 
        //    .render("register", { error: "All Fields are required" }); 
    } 

    try { 
        // Check if user already exists 
        const existingUser = await User.findOne({ username }); 
        if (existingUser) { 
            console.log("ERROR USERNAME EXISTS");
            
            return res 
                .status(409) 
              //  .render("register", { error: "Username already exists" }); 
            
        } 
  
        // Hash the password before saving it to the database 
        const salt = await bcrypt.genSalt(15); 
        const hashedPassword = await bcrypt.hash(password, salt); 
  
        // Create and save the new user 
        const newUser = new User({ username, password: hashedPassword }); 
        await newUser.save(); 
        console.log("New user made xD");
        return res.status(200).json({ message: "success" });
        //return res.redirect("/login"); 
    } catch (err) { 
        return res.status(500) //.json({ message: err.message }); 
    } 
}); 
  
// User login route 
router.post(                            // NEED TO FIND USER FROM DATABASE NOT JUST EXPECT IT TO EXIST LOL
    '/login', 
    passport.authenticate("local", { session: true }), //????????????????
    async (req, res) => { 
        
        req.session.name = req.body.username; 
        /*
        console.log("XXXXXXXXXXXXXXXXXXXXXXX");
        console.log(req.session);
        console.log(req.session.name);
        console.log("XXXXXXXXXXXXXXXXXXXXXXX");
        req.session.save(); 
        console.log("Logging in user: <" + req.body.username + "> ...");
        return res.status(200).json({ message: "success" });
        */

       // await req.session.save();
        console.log(req.session);
        console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
        console.log(req.sessionID);
        
        console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
        //return 
        res.status(200).json({ message: "success" });
        console.log("THIS SHOULD NOT EXIST HERE!");
    }
); 


router.get('/checkAuth', (req, res) => {

    
    if (req.isAuthenticated()) {
        console.log("LOGGED IN!");
    } else {
        console.log("NOT LOGGED IN :<");
    }
    console.log("-----------------------");
    console.log(req.session);
    console.log("-----------------------");
    /*
    console.log("----------------------");
    console.log("in checkAuth: ");
    console.log(req.session);
    */
   res.send({ username: req.session.name } )
})

  
router.get("/logout", (req, res) => { 
    req.session.destroy(); 
    res.status(200).json({ message: "logout success" });        // Add conditional response?
}); 

module.exports = router;  
