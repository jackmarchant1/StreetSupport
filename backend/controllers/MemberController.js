const Ambassador = require('../models/Ambassador');
const Member = require('../models/Member');
const Organisation = require('../models/Organisation');
const bcrypt = require('bcrypt');


exports.createMember = async (req, res) => {
    const { name, member_since, organisationId } = req.body;
    try {
        // First check if the organisation exists
        console.log(organisationId);
        const organisation = await Organisation.findById(organisationId);
        if (!organisation) {
            return res.status(401).send({ message: 'Organisation not found' });
        }
        const newMember = new Member({
            name,
            member_since,
            organisation: organisationId
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
    console.log("Getting members");
    const { organisationId } = req.query;
    try {
        const members = await Member.find({ organisation: organisationId });
        res.json(members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}