const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({  path: './.env' });


const connectDB = async() => {
 //Add db connect string in .env file with variable name MONGODB_CONNECT
    mongoose.connect(process.env.MONGODB_CONNECT)
    .then(() => {
        console.log("Connected to DB")
    })
    .catch((err) => console.error("DB ERROR: ", err));
};

module.exports = connectDB;
