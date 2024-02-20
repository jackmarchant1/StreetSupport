const express = require('express')
const cors = require('cors')
const router = require('./routes/router')

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

app.use('/', router);

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});

