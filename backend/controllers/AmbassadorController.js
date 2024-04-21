const Ambassador = require('../models/Ambassador');
const Organisation = require('../models/Organisation');
const Member = require('../models/Member');
const bcrypt = require('bcrypt');


exports.createAmbassador = async (req, res) => {
    const { email, password, organisationId, name } = req.body;
    try {
        // First check if the organisation exists
        const organisation = await Organisation.findById(organisationId);
        if (!organisation) {
            return res.status(401).send({ message: 'Organisation not found' });
        }
        // Create a new Ambassador document
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt)
        const newAmbassador = new Ambassador({
            email,
            password: passwordHash,
            organisation: organisationId,
            name: name
        });
        // Save the Ambassador document to the database
        const savedAmbassador = await newAmbassador.save();
        req.session.userId = savedAmbassador._id;
        res.status(201).json(savedAmbassador);
    } catch (error) {
        res.status(500).send({ message: 'Error creating new ambassador' });
    }
};

exports.loginAmbassador = async (req, res) => {
    const { email, password } = req.body;
    try {
        const ambassador = await Ambassador.findOne({email});
        if (!ambassador) {
            return res.status(401).send({isAuthenticated: false, message: "Ambassador with that email does not exist"});
        }
        const isMatch = await bcrypt.compare(password, ambassador.password);
        if (!isMatch) {
            return res.status(401).send({isAuthenticated: false, message: "Password is incorrect"})
        }
        //Check if organisation exists
        const organisation = await Organisation.findById(ambassador.organisation);
        if (!organisation) {
            return res.status(401).send({isAuthenticated: false, message: "Organisation does not exist"})
        }
        const returnAmbassador = { ...ambassador._doc };
        delete returnAmbassador.password;
        returnAmbassador.organisation = organisation;
        req.session.userId = returnAmbassador._id;
        return res.status(200).send({isAuthenticated: true, ambassador: returnAmbassador, message: "Log in success"})
    } catch (error) {
        res.status(500).send({ isAuthenticated: false, message: 'Server error during login.' });
    }
}

exports.logoutAmbassador = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({isAuthenticated: false, message: "Error logging out"});
        }
        res.status(200).send({isAuthenticated: false, message: "Log out success"});
    });
}

exports.suspendMember = async (req, res) => {
    const { memberId } = req.body;

    try {
        console.log("Suspending member");
        const suspendedMember = await Member.suspendMember(memberId);
        res.status(200).send({ message: 'Member suspended successfully', suspendedMember });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
};

exports.unsuspendMember = async (req, res) => {
    const { memberId } = req.body;

    try {
        console.log("Unsuspending member");
        const unsuspendedMember = await Member.unsuspendMember(memberId);
        res.status(200).send({ message: 'Member unsuspended successfully', unsuspendedMember });
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
};

exports.deleteMember = async(req, res) => {
    const {memberId} = req.body;

    try {
        console.log('attempting to delete member with id ' + memberId);
        const deletedMember = await Member.deleteMember(memberId);
        res.status(200).send({message: 'Member deleted successfully', deletedMember});
    } catch (error) {
        res.status(500).send({error: 'Internal server error'});
    }
}


exports.checkAuth = (req, res, next) => { //Middleware to check if auth'd whenever sensitive info being requested
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated');
    }
    next();
}

