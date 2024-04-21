const express = require('express');
const router = express.Router();
const ambassadorController = require('../controllers/AmbassadorController');

router.post('/login', ambassadorController.loginAmbassador);

router.post('/logout', ambassadorController.logoutAmbassador);

router.post('/suspendMember', ambassadorController.suspendMember);

router.post('/unsuspendMember', ambassadorController.unsuspendMember);

router.post('/deleteMember', ambassadorController.deleteMember);

router.post('/create', ambassadorController.createAmbassador);

router.get('/isAuthenticated', ambassadorController.checkAuth);


module.exports = router