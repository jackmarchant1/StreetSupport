const express = require('express');
const cors = require('cors');
const router = require('./routes/router');
const ambassadorRouter = require('./routes/ambassador_routes');
const memberRouter = require('./routes/member_routes');
const connectDB = require('./config/DBConnection');
const session = require('express-session');

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

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Backend running on http://localhost:${port}`);
    });
});




