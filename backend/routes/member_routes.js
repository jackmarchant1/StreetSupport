const express = require('express');
const router = express.Router();
const memberController = require('../controllers/MemberController');

router.post('/create', memberController.createMember);

router.get('/getMembersFromOrg', memberController.getMembersFromOrg);

module.exports = router