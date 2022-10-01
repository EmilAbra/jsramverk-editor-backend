require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const editor = require("./routes/editor.js");

const app = express();
const httpServer = require("http").createServer(app);
const docsModel = require('./models/docs');
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

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let throttleTimer;

io.sockets.on('connection', function(socket) {
    console.log(socket.id);
    socket.on('create', function(room) {
        socket.join(room);
    });

    socket.on("docsData", function (data) {
        // console.log(data.content);
        socket.to(data["_id"]).emit("docsData", data);

        clearTimeout(throttleTimer);
        console.log("writing");
        throttleTimer = setTimeout(function() {
            console.log("now it should save to database")
            if (data) {
                docsModel.updateDoc(data);
            }
        }, 2000);
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
const server = httpServer.listen(port, () => {
    console.log(`editor api is listening on ${port}`);
});

module.exports = server;
