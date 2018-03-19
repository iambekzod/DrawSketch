/*jshint esversion: 6 */

// Imports ===================================================
const crypto = require('crypto');
const socketio = require("socket.io");
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const https = require('https');
const socketIO = require('socket.io');
const cors = require('cors');
<<<<<<< HEAD
const short = require('short-uuid');
=======

>>>>>>> fbbc046acfd39a78c33e8564c4d47d2f2aa6179d
const keys = require('./config/keys.js');
const Accounts = require('./models/accounts.js');
require('./config/passport.js');

// Database =================================================== Connection URL
mongoose.connect(keys.mongoURL);

// Server ===================================================
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: keys.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
        httpOnly: true,
        sameSite: true
    }
}));

app.use(require('./routes'));
app.use(function (req, res, next) {
    res.status(501).end("Invalid API endpoint: " + req.url);
    console.log("HTTP Response", res.statusCode);
});

var privateKey = fs.readFileSync('server.key');
var certificate = fs.readFileSync('server.crt');
var config = {
    key: privateKey,
    cert: certificate
};
const PORT = 3001;

server = https.createServer(config, app).listen(PORT, function (err) {
    if (err) 
        console.log(err);
    else 
        console.log("HTTPS server on https://localhost:%s", PORT);
    }
);

<<<<<<< HEAD
// io.on('connection', function (socket) {     console.log('a user connected: '
// + socket.id + " total: " + io.engine.clientsCount); socket.on('disconnect',
// function () {         console.log('user disconnected');     });
// socket.on('login', function (data) { console.log(data);         var request =
// JSON.parse(data);         if (!validator.isAlphanumeric(request.username))
// return socket.emit('check-login', JSON.stringify({             status: -1,
// log: "bad username input, must be alphanumeric"         }));         if
// (!validator.isAlphanumeric(request.password)) return
// socket.emit('check-login', JSON.stringify({             status: -1,   log:
// "bad password input, must be alphanumeric"         })); Accounts.findOne({
// username: request.username, }).exec(function (err, user) {   if (err) return
// socket.emit('check-login', JSON.stringify({ status: -1,           log: err
// }));             if (!user) return socket.emit('check-login',
// JSON.stringify({                 status: -1, log: "Username or password is
// invalid"             })); if (user.password !==
// generateHash(request.password, user.salt)) return socket.emit('check-login',
// JSON.stringify({                 status: -1,     log: "Username or password
// is invalid"             })); socket.emit('check-login', JSON.stringify({
// status: 0,   user: user             }));         });     });
// socket.on('register', function (data) {         var request =
// JSON.parse(data);         if (!validator.isAlphanumeric(request.username))
// return socket.emit('check-register', "bad username input, must be
// alphanumeric");      if (!validator.isAlphanumeric(request.password)) return
// socket.emit('check-register', "bad password input, must be alphanumeric"); if
// (!validator.isAlphanumeric(request.firstname)) return
// socket.emit('check-register', "bad firstname input, must be alphanumeric");
// if (!validator.isAlphanumeric(request.lastname)) return
// socket.emit('check-register', "bad lastname input, must be alphanumeric"); if
// (!validator.isEmail(request.email)) return socket.emit('check-register', "bad
// email input, must be alphanumeric"); Accounts.findOne({ username:
// request.username, }).exec(function (err, user) {             if (err) return
// console.log(err);            if (!user) {                 var salt =
// generateSalt();      var hash = generateHash(request.password, salt); var
// newUser = Accounts({                     name: request.firstname + " " +
// request.lastname,                     username: request.username, password:
// hash,                     salt: salt,     }); newUser.save(function (err) {
// if (err) console.log(err);                    else
// socket.emit('check-register', user); });             } else {
// socket.emit('check-register', "Username already exists");             }   });
//     }); //socket.on('drawing', (data) => socket.broadcast.emit('drawing',
// data)); });
=======
const io = socketIO(server);

io.on('connection', function (socket) {
    socket.on("gameState", (state) => {
        io.emit('return', state)
    })
})
>>>>>>> fbbc046acfd39a78c33e8564c4d47d2f2aa6179d
