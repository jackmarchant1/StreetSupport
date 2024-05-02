const express = require('express');
const router = express.Router();
const memberController = require('../controllers/MemberController');
const multer = require("multer");
const upload = require('../config/multer.config')

router.post('/create', upload.single('image'), memberController.createMember);

router.get('/get', memberController.getMember);

router.get('/getMembersFromOrg', memberController.getMembersFromOrg);

router.get('/getSuspendedMembersFromOrg', memberController.getSuspendedMembersFromOrg);

router.post('/acceptPayment', memberController.acceptPayment);

module.exports = router