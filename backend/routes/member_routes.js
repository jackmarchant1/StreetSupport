const express = require('express');
const router = express.Router();
const memberController = require('../controllers/MemberController');

router.post('/create', memberController.createMember);

router.get('/getMembersFromOrg', memberController.getMembersFromOrg);

router.get('/getSuspendedMembersFromOrg', memberController.getSuspendedMembersFromOrg);

module.exports = router