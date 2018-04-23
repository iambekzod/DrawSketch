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
const passport = require('passport');

const dotEnv = require('dotenv');
dotEnv.config({ path: path.resolve(__dirname, '-nogit.env') })

const Accounts = require('./models/accounts.js');
const GameServer = require('./routes/api/gameServer.js');
const lobbies = require('./routes/api/rooms.js');

// Database =================================================== Connection URL
require('./config/passport.js');
mongoose.connect(process.env.MONGO_URL);

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
var interval;
io
    .sockets
    .on('connection', socketioJwt.authorize({
        secret: process.env.JWT_SECRET, callback: false, timeout: 10000 // 15 seconds to send the authentication message
    }))
    .on('authenticated', function (socket) {
        //this socket is authenticated, we are good to handle more events from it.
        socket.on('join', (room) => {
            const found = gameServer.findGame(room[1].id);
            if (found == null) {
                gameServer.createGame(room[1].id);
                gameServer.joinGame(room[0], room[1].id);
            } else {
                const game = gameServer.games[found]
                if (game.inGame(room[0]) == false) {
                    gameServer.joinGame(room[0], room[1].id);
                }
            }
            socket.join(room[1].id)
            io
                .sockets
                . in(room[1].id)
                .emit('newUser', room[1]);
        })
        socket.on("gameState", (state) => {
            var state = JSON.parse(state);
            var updated = gameServer.setGameState(state.id, state.game)
            var game = lobbies.find((room) => room.id === state.id);
            const index = lobbies.indexOf(game);
            lobbies[index].gameState = state.game;
            io
                .sockets
                . in(state.id)
                .emit('return', JSON.stringify(updated.state))
        })
        socket.on("beginRound", (game) => {
            const found = gameServer.findGame(JSON.parse(game).id);
            lobbies[found].started = true;
            lobbies[found].roundsPlayed++;
            interval = startTimer(found, lobbies[found].timeLimit);
            io
                .sockets
                . in(gameServer.games[found].id)
                .emit('getWord', gameServer.games[found].getWord())
            io
                .sockets
                . in(gameServer.games[found].id)
                .emit('startRound', JSON.stringify(game.state));
        })
        socket.on("guess", (guess) => {
            const found = gameServer.findGame(guess.id);
            const user = lobbies[found]
                .players
                .find((player) => player.username == guess.user.username);
            const userIndex = lobbies[found]
                .players
                .indexOf(user);
            if (guess.guess == gameServer.games[found].currentWord) {
                lobbies[found].players[userIndex].wins++;
                io
                    .sockets
                    . in(gameServer.games[found].id)
                    .emit('right', gameServer.games[found])
            } else {
                io
                    .sockets
                    . in(gameServer.games[found].id)
                    .emit('wrong', gameServer.games[found])
            }
        })
        socket.on("endRound", (game) => {
            const found = gameServer.findGame(game);
            endRound(found);
        })
        socket.on('disconnect', function () {
          socket.emit('disconnected');
        });
    });

function pickPlayer(game) {
    var index = 0;
    while (game.drawer.username != game.players[index].username) {
        index++;
    }
    if (index == 0 || index < game.players.length - 1) {
        return index + 1;
    }
    return 0;
}

function endRound(gameIndex) {
    clearInterval(interval);
    if (lobbies[gameIndex].roundsPlayed == lobbies[gameIndex].rounds) {
        io
            .sockets
            . in(gameServer.games[gameIndex].id)
            .emit('gameOver', lobbies[gameIndex]);
            lobbies.splice(gameIndex, 1);
        return;
    }
    const index = pickPlayer(lobbies[gameIndex]);
    lobbies[gameIndex].started = false;
    lobbies[gameIndex].drawer = lobbies[gameIndex].players[index];
    io
        .sockets
        . in(gameServer.games[gameIndex].id)
        .emit('roundEnd', lobbies[gameIndex]);
}

// - countdown-timer //
function startTimer(index, duration) {
    var timer = duration,
        minutes,
        seconds;
    var interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10
            ? "0" + minutes
            : minutes;
        seconds = seconds < 10
            ? "0" + seconds
            : seconds;

        const time = minutes + ":" + seconds;
        lobbies[index].timeElapsed = time;
        io
            .sockets
            . in(gameServer.games[index].id)
            .emit('tick', time);

        if (--timer < 0) {
            endRound(index);
        }
    }, 1000);
    return interval;
}
