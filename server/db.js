const mongoose = require('mongoose');


const connectDB = async() => {
    mongoose.connect("mongodb://127.0.0.1:27017/LoginAuth")
    .then(() => {
        console.log("Connected to DB")
    })
    .catch((err) => console.error("DB ERROR: ", err));
};

module.exports = connectDB;