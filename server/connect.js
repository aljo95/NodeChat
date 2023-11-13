// Do not change this file
//require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

async function main(callback) {

    const URI = "mongodb://127.0.0.1:27017";
    
    const client = new MongoClient(URI);    //, { useNewUrlParser: true, useUnifiedTopology: true }

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        console.log("CONNECTED ?");

        // Make the appropriate DB calls
        await callback(client);

    } catch (e) {
        // Catch any errors
        console.error(e);
        throw new Error('Unable to Connect to Database')
    }
}

module.exports = main;