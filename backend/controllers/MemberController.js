const Member = require('../models/Member');
const Organisation = require('../models/Organisation');


exports.createMember = async (req, res) => {
    const { first_name, last_name, member_since, orgId } = req.body;
    try {
        // First check if the organisation exists
        const organisation = await Organisation.findById(orgId);
        if (!organisation) {
            return res.status(401).send({ message: 'Organisation not found' });
        }
        const newMember = new Member({
            first_name,
            last_name,
            member_since,
            organisation: orgId
        });
        // Save the Member document to the database
        const savedMember = await newMember.save();
        // Send response with new member
        res.status(201).json(savedMember);
    } catch (error) {
        console.error('Error creating ambassador: ', error);
        res.status(500).send({ message: 'Error creating new member' });
    }
};

exports.getMembersFromOrg = async (req, res) => {
    const { orgId } = req.query;
    try {
        const members = await Member.find({ organisation: orgId });
        res.json(members);
    } catch (err) {
        res.status(500).send('Server Error');
    }
}