const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    member_since: {type: Date, required: true},
    is_suspended: {type: Boolean, default: false, required: true},
    bio: {type: String, required: false},
    image_url: { type: String, required: false },
    organisation: {type: Schema.Types.ObjectId, ref: 'Organisation', required: true}
});

memberSchema.statics.suspendMember = async function(memberId) {
    console.log("Suspending member")
    try {
        // Find the member by ID and update the is_suspended field to true
        const member = await this.findByIdAndUpdate(memberId, { is_suspended: true }, { new: true });
        return member;
    } catch (error) {
        console.error('Error suspending member:', error);
        throw error;
    }
};

memberSchema.statics.unsuspendMember = async function(memberId) {
    console.log("Suspending member")
    try {
        // Find the member by ID and update the is_suspended field to true
        const member = await this.findByIdAndUpdate(memberId, { is_suspended: false }, { new: true });
        return member;
    } catch (error) {
        console.error('Error suspending member:', error);
        throw error;
    }
};

memberSchema.statics.deleteMember = async function(memberId) {
    try {
        // Find the member by ID and delete it
        const deletedMember = await this.findByIdAndDelete(memberId);
        console.log('member is deleted')
        return deletedMember;
    } catch (error) {
        // Handle any errors
        console.error('Error deleting member:', error);
        throw error;
    }
};



const Member = mongoose.model('Member', memberSchema); //This is creating member model, can interact with 'members' collection in DB

module.exports = Member;
