const express = require('express');
const cors = require('cors');
const router = require('./routes/router');
const ambassadorRouter = require('./routes/ambassador_routes');
const memberRouter = require('./routes/member_routes');
const connectDB = require('./config/DBConnection');
const session = require('express-session');
const request = require('supertest');
const multer = require('multer');
const path = require('path');

const app = express()
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}


app.use(cors(corsOptions));

app.use(session({
    secret: 'secret123908', //TODO: Get better secret key and change secure to true
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }
}));

app.use('/api', router);
app.use('/api/ambassador', ambassadorRouter);
app.use('/api/member', memberRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        app.listen(port, () => {
            console.log(`Backend running on http://localhost:${port}`);
        });
    })
}

module.exports = app;




