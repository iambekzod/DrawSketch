/*jshint esversion: 6 */

// Imports
// ===================================================
const crypto = require('crypto');
const socketio = require("socket.io");
const express = require('express');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const validator = require('validator');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const session = require('express-session');
const https = require('https');
const socketIO = require('socket.io');

// Database
// ===================================================
// Connection URL

//const collection = client.db("drawsketch").collection("accounts");
var uri = "mongodb+srv://drawsketch-user:vnhelXsx3NfdVyh3@cluster0-bmqza.mongodb.net/test";
var db;
MongoClient.connect(uri, function (err, client) {
    if (err) throw err;

    db = client;
});

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
    });
    //socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
});