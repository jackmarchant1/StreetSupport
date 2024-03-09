const express = require('express');
const router = express.Router();
const ambassadorController = require('../controllers/AmbassadorController');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    res.send({"Logged in": true, "username": username, "password": password});
});

router.post('/create', (req, res, next) => {
    console.log('Route /create is hit');
    next(); // Pass control to the next handler, which is your controller
}, ambassadorController.createAmbassador);


module.exports = router