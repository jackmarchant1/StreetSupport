const Ambassador = require('../models/Ambassador');
const Organisation = require('../models/Organisation');


exports.createAmbassador = async (req, res) => {
    const { email, password, organisationId } = req.body;
    try {
        // First check if the organisation exists
        const organisation = await Organisation.findById(organisationId);
        if (!organisation) {
            return res.status(404).send({ message: 'Organisation not found' });
        }
        // Create a new Ambassador document
        const newAmbassador = new Ambassador({
            email,
            password, // Note: In a real application, ensure you hash passwords before storing them
            organisation: organisationId
        });
        // Save the Ambassador document to the database
        const savedAmbassador = await newAmbassador.save();
        // Send response with new ambassador
        res.status(201).json(savedAmbassador);
    } catch (error) {
        console.error('Error creating ambassador: ', error);
        res.status(500).send({ message: 'Error creating new ambassador' });
    }
};
