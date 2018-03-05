/*jshint esversion: 6 */

// Imports
// ===================================================
const crypto = require('crypto');
const socketio = require("socket.io");
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const validator = require('validator');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const session = require('express-session');
const https = require('https');
const socketIO = require('socket.io');

const keys = require('./keys.js');
const accounts = require('./user.js');


function generateSalt() {
    return crypto.randomBytes(16).toString('base64');
}

function generateHash(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

// Database
// ===================================================
// Connection URL
mongoose.connect(keys.mongoURL);

// Server
// ===================================================

const app = express();
app.use(express.static('public'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept-Type');
    // res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

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
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});

const io = socketIO(server);

io.on('connection', function (socket) {
    console.log('a user connected: ' + socket.id);
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('login', function (data) {
        console.log("Login: " + data);
    });
    socket.on('register', function (data) {
        console.log("Register: " + data);

        var userData = JSON.parse(data);

        var username = userData.username;
        accounts.findOne({
            username: username,
        }).exec(function (err, user) {
            if (err) return console.log(err);

            if (!user) {
                console.log("no user");

                var salt = generateSalt();
                var hash = generateHash(userData.password, salt);
                var newUser = accounts({
                    name: userData.firstname + " " + userData.lastname,
                    username: userData.username,
                    password: hash,
                    salt: salt,
                  });

                newUser.save(function (err) {
                    if (err) console.log(err);
                    else socket.emit('check-register', user);
                });
            } else {
                socket.emit('check-register', "Username already exists");
            }
        });
    });
    //socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
});