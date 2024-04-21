const Member = require('../models/Member');
const Organisation = require('../models/Organisation');
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/DBConnection');
const multer = require('multer');
const path = require('path');
const upload = require('../config/multer.config')

exports.createMember = async (req, res) => {
    const { first_name, last_name, member_since, bio, orgId } = req.body;
    const imageUrl = req.file? path.basename(req.file.path): '';
    try {
        // First check if the organisation exists
        console.log(orgId)
        const organisation = await Organisation.findById(orgId);
        if (!organisation) {
            console.log('Org does not exist');
            return res.status(404).send({ message: 'Organisation not found' });
        }

        const newMember = new Member({
            first_name,
            last_name,
            member_since: new Date(),
            bio,
            organisation: orgId,
            image_url: imageUrl,
            is_suspended: false
        });
        console.log('creating this new member: ' + newMember);

        // Save the Member document to the database
        const savedMember = await newMember.save();
        // Send response with new member
        res.status(201).json(savedMember);
    } catch (error) {
        res.status(500).send({ message: 'Error creating new member', error: error.message });
    }
};


exports.getMembersFromOrg = async (req, res) => {
    const { orgId } = req.query;
    try {
        const members = await Member.find({ organisation: orgId, is_suspended: false });
        res.json(members);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getSuspendedMembersFromOrg = async (req, res) => {
    const { orgId } = req.query;
    try {
        const members = await Member.find({ organisation: orgId, is_suspended: true });
        res.json(members);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getMember = async(req, res) => {
    const { memberId } = req.query;
    console.log('getting member with id ' + memberId);
    try {
        const member = await Member.findById(memberId);
        if (!member) {
            console.log('could not find member with member id ' + memberId);
            res.status(404).send({message: 'Member does not exist'});
            return;
        }
        res.status(200).send(member);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

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
            const memberSince = faker.date.past();
            const bio = faker.person.bio();
            const image_url = '/Users/jackmarchant/WebStormProjects/StreetSupport/backend/uploads/image-1713695136440-688627871.png'

            const member = new Member({
                first_name: firstName,
                last_name: lastName,
                member_since: memberSince,
                organisation: organisation._id,
                bio,
                image_url,
                is_suspended: false
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
