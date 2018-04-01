/*jshint esversion: 6 */

// Imports ===================================================
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const socketioJwt = require('socketio-jwt2');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');

const keys = require('./config/keys.js');
const passport = require('passport');
const Accounts = require('./models/accounts.js');
const GameServer = require('./routes/api/gameServer.js');

require('./config/passport.js');

// Database =================================================== Connection URL
mongoose.connect(keys.mongoURL);

// Server ===================================================
const app = express();
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());

if (app.get('env') == 'production') {
    app.use(morgan('combined', {
        skip: function (req, res) { return res.statusCode < 400 }
      }));
} else {
    app.use(morgan('dev'));
}

app.use(passport.initialize());
app.use(require('./routes'));
app.use(function (req, res, next) {
    res
        .status(501)
        .end("Invalid API endpoint: " + req.url);
});

const PORT = process.env.PORT || 8080;

server = http
    .createServer(app)
    .listen(PORT, function (err) {
        if (err) 
            console.log(err);
        else 
            console.log("HTTP server listening on port: %s", PORT);
        }
    );

const io = socketIO(server);
var gameServer = new GameServer();

io
    .sockets
    .on('connection', socketioJwt.authorize({
        secret: keys.jwtSecret, callback: false, timeout: 10000 // 15 seconds to send the authentication message
    }))
    .on('authenticated', function (socket) {
        //this socket is authenticated, we are good to handle more events from it.
        console.log("AUTH USER");
        socket.on('join', (room) => {
            socket.join(room);
        })
        socket.on("gameState", (state) => {
            var state = JSON.parse(state);
            var updated = gameServer.setGameState(state.id, state.game)
            io
                .sockets
                . in(1)
                .emit('return', JSON.stringify(updated.state))
        })
        socket.on("beginRound", (player) => {
            game = gameServer.findGame(1);
            io
                .sockets
                . in(game.id)
                .emit('getWord', "Cat");
            io
                .sockets
                . in(game.id)
                .emit('startRound', JSON.stringify(game.state));
        })
        socket.on("guess", (guess) => {
            game = gameServer.findGame(1);
            if (guess == 'cat') {
                console.log("THE GUESS IS CORRECT");
                io
                    .sockets
                    . in(game.id)
                    .emit('right', game)
            } else {
                io
                    .sockets
                    . in(game.id)
                    .emit('wrong', game)
            }
        })
        socket.on("endRound", (game) => {
            console.log("ABOUT TO END ROUND");
            game = gameServer.findGame(1);
            io
                .sockets
                . in(game.id)
                .emit('roundEnd', JSON.stringify(game.state));
        })
    });
