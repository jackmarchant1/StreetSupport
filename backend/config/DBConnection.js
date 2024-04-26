const mongoose = require('mongoose');

const mongoDB = "mongodb://localhost:27017/StreetSupport";
let connection;

mongoose.Promise = global.Promise;

const connectDB = async () => {
    await mongoose.connect(mongoDB).then(result => {
        connection = result.connection;
        console.log("Connection successful")
    }).catch(err => {
        console.log("Error encountered: " + err)
    })
};

module.exports = connectDB;