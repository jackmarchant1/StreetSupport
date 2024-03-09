const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
    name: {type: String, required: true},
    member_since: {type: Date, required: true},
    website: {type: String, required: true}
});

const Org = mongoose.model('Organisation', orgSchema);

module.exports = Org;