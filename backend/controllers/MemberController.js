const Member = require('../models/Member');
const Organisation = require('../models/Organisation');
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/DBConnection');
const multer = require('multer');
const path = require('path');
const upload = require('../config/multer.config');
const stripe = require('stripe')('sk_test_51PBb2OCxJlYqOmKBYKn1cSYwvv0wKytWuWNHdprMXPVy0CVUvXxjacrTpOJdbxAEP8QN1R3FFaUtGTDHWo9qfuyO00NoieUCE2');


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
    try {
        console.log("retrieving member")
        const member = await Member.findById(memberId);
        if (!member) {
            console.log('could not find member with member id ' + memberId);
            return res.status(404).send({message: 'Member does not exist'});
        }
        const organisation = await Organisation.findById(member.organisation);
        if (!organisation) {
            console.log("Organisation does not exist: " + member.organisation)
            return res.status(404).send({message: "Organisation does not exist"})
        }
        member.organisation = organisation;
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
            console.log('No organisation found in the database');
            return;
        }

        for (let i = 0; i < amount; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const memberSince = faker.date.past();
            const bio = "This will be a little profile about the member. " +
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vulputate tellus nec " +
                "arcu scelerisque pharetra. Proin sodales accumsan sollicitudin. Suspendisse porttitor hendrerit" +
                " varius. Nam diam ipsum, mollis vitae diam vel, rhoncus semper ligula. Fusce non est erat. Nam eu " +
                "massa erat. Praesent sed venenatis risus, et aliquet metus. Nulla eu mi non lectus sodales ullamcorper " +
                "sed a ligula.";
            const image_url = 'homeless_'+(Math.floor(Math.random() * 4) + 1) + ".jpg";

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
        console.log('Error generating random members:', error);
        throw(error);
    }
};

exports.acceptPayment = async(req, res) => {
    console.log('accepting payment on backend');
    const { memberId } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1PBc3OCxJlYqOmKBB5WB9ghJ',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/donation/'+memberId,
            cancel_url: 'http://localhost:3000/donation/'+memberId,
        });
        console.log(session.url);
        res.status(200).json({ url: session.url });
    } catch(e) {
        console.log('error in creating session' + e);
        res.status(500);
    }

}

