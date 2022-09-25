require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const editor = require("./routes/editor.js");

const app = express();

const port = process.env.PORT || 1337;

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.set('json spaces', 4);
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/editor", editor);

app.get('/', (req, res) => {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    res.json({
        msg: "Editor app on " + url,
    });
});

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    
    err.status = 404;
    next(err);
});

// Start up server
const server = app.listen(port, () => {
    console.log(`editor api is listening on ${port}`);
});

module.exports = server;
