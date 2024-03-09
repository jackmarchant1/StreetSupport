const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    res.send({"Logged in": true, "username": username, "password": password});
});

module.exports = router