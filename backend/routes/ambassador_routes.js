const express = require('express');
const router = express.Router();
const ambassadorController = require('../controllers/AmbassadorController');

router.post('/login', ambassadorController.loginAmbassador);

router.post('/create', (req, res, next) => {
    console.log('Route ambassador/create is hit');
    next(); // Pass control to the next handler, which is your controller
}, ambassadorController.createAmbassador);

router.get('/isAuthenticated', ambassadorController.checkAuth);


module.exports = router