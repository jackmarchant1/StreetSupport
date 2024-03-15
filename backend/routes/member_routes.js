const express = require('express');
const router = express.Router();
const memberController = require('../controllers/MemberController');

router.post('/create', memberController.createMember);

module.exports = router