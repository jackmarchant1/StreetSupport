const express = require('express');
const router = express.Router();
const ambassadorController = require('../controllers/AmbassadorController');

router.post('/login', ambassadorController.loginAmbassador);

router.post('/create', ambassadorController.createAmbassador);

router.get('/isAuthenticated', ambassadorController.checkAuth);


module.exports = router