const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new mongoose.Schema({
    name: {type: String, required: true},
    member_since: {type: Date, required: true},
    organisation: {type: Schema.Types.ObjectId, ref: 'Organisation', required: true}
});

const Member = mongoose.model('Member', memberSchema); //This is creating member model, can interact with 'members' collection in DB
module.exports = Member;
