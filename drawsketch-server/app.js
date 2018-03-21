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
const keys = require('./config/keys.js');
const Accounts = require('./models/accounts.js');
const GameServer = require('./routes/api/gameServer.js')
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

var io = socketIO(server);
var gameServer = new GameServer();
io.on('connection', function (socket) {
    socket.on('join', (room) => {
        socket.join(room);
        gameServer.joinGame(room);
    })
    socket.on("gameState", (state) => {
        gameServer.setGameState(state.id,state.game)
        io.sockets.in(game.id).emit('return', JSON.stringify(gameServer.findGame(state.id).state))
    })
    socket.on("beginRound", (player) => {
        game = gameServer.findGame(player.id);
        io.sockets.in(game.id).emit('getWord', "Cat");
        io.sockets.in(game.id)
            .broadcast
            .emit('startRound', JSON.stringify(game.state));
    })
    socket.on("join", (player) => {
        gameServer.findGame(player.id).joinGame(player);
    })
})