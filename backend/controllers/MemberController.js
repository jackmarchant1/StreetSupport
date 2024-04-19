const Member = require('../models/Member');
const Organisation = require('../models/Organisation');
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/DBConnection');


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
};

exports.generateRandomMembers = async (amount) => {
    try {
        await connectDB();

        const members = [];
        const organisation = await Organisation.findById('65eca2fe501f7ae0f48737dc');

        if (!organisation) {
            console.error('No organisation found in the database');
            return;
        }

        for (let i = 0; i < amount; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const memberSince = faker.date.past(); // Random past date

            const member = new Member({
                first_name: firstName,
                last_name: lastName,
                member_since: memberSince,
                organisation: organisation._id
            });

            members.push(member);
        }

        // Insert all generated members into the database
        await Member.insertMany(members);
        console.log(amount + ' random members inserted successfully');
    } catch (error) {
        console.error('Error generating random members:', error);
    }
};
