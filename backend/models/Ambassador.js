const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    organisation: {type: Schema.Types.ObjectId, ref: 'Organisation', required: true}
});

const Ambassador = mongoose.model('Ambassador', userSchema); //This is creating user model, can interact with 'users' collection in DB
module.exports = Ambassador;