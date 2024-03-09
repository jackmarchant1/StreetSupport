const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hello world");
});

router.post('/login', (req, res) => {
    console.log("success")
    res.send({"status": "correct"});
})

module.exports = router