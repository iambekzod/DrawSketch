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
const io = require('socket.io')(https);

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

function onConnection(socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}
io.on('connection', onConnection);

var privateKey = fs.readFileSync('server.key');
var certificate = fs.readFileSync('server.crt');
var config = {
    key: privateKey,
    cert: certificate
};
const PORT = 3001;

https.createServer(config, app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});