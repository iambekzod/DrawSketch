/*jshint esversion: 6 */

// Imports ===================================================
const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt2');
const cors = require('cors');

const keys = require('./config/keys.js');
const Accounts = require('./models/accounts.js');
const GameServer = require('./routes/api/gameServer.js');
const lobbies = require('./routes/api/rooms.js');
require('./config/passport.js');

// Database =================================================== Connection URL
mongoose.connect(keys.mongoURL);

// Server ===================================================
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// https://www.namecheap.com/support/knowledgebase/article.aspx/9737/2208/pointi
// n g-a-domain-to-the-heroku-app#www.yourdomain.tld
// https://gist.github.com/Shourai/bfd9f549a41c836c99c0c660c9271df6

var whitelist = ['https://drawsketch.herokuapp.com', 'https://drawsketch.me', 'http://localhost:3000']
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS: ' + origin))
        }
    }
}));

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
    res
        .status(501)
        .end("Invalid API endpoint: " + req.url);
    console.log("HTTP Response", res.statusCode);
});

const PORT = process.env.PORT || 8080;

server = http
    .createServer(app)
    .listen(PORT, function (err) {
        if (err) 
            console.log(err);
        else 
            console.log("HTTP server listening on port %s", PORT);
        }
    );

const io = socketIO(server);
var gameServer = new GameServer();
var interval;
io
    .sockets
    .on('connection', socketioJwt.authorize({
        secret: keys.jwtSecret, callback: false, timeout: 10000 // 15 seconds to send the authentication message
    }))
    .on('authenticated', function (socket) {
        //this socket is authenticated, we are good to handle more events from it.
        console.log("AUTH USER");
        socket.on('join', (room) => {
            const found = gameServer.findGame(room[1].id);
            if (found == null) {
                console.log("CREATING ROOM");
                gameServer.createGame(room[1].id);
                console.log("PLAYER JOINING", room[0].username);
                gameServer.joinGame(room[0], room[1].id);
            } else {
                const game = gameServer.games[found]
                if (game.inGame(room[0]) == false) {
                    console.log("PLAYER JOINING", room[0].username);
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
            interval = startTimer(found, 60);
            console.log(interval);
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
            if (guess.guess == gameServer.games[found].currentWord) {
                console.log(guess.user);
                const userIndex = lobbies[found]
                    .players
                    .indexOf(guess.user);
                console.log(userIndex);
                io
                    .sockets
                    . in(gameServer.games[found].id)
                    .emit('right', gameServer.games[found])
            } else {
                console.log("WRONG");
                io
                    .sockets
                    . in(gameServer.games[found].id)
                    .emit('wrong', gameServer.games[found])
            }
        })
        socket.on("endRound", (game) => {
            const found = gameServer.findGame(game);
            endRound(found);
            console.log(interval);
            clearInterval(interval);
        })
    });

function pickPlayer(game) {
    var index = 0;
    while (game.drawer.username != game.players[index].username) {
        index++;
    }
    if (index == 0 || index < game.players.length - 1) {
        console.log("IM HERE");
        return index + 1;
    }
    return 0;
}

function endRound(gameIndex) {
    const index = pickPlayer(lobbies[gameIndex]);
    console.log("INDEX IS ", index);
    lobbies[gameIndex].started = false;
    lobbies[gameIndex].drawer = lobbies[gameIndex].players[index];
    io
        .sockets
        . in(gameServer.games[gameIndex].id)
        .emit('roundEnd', lobbies[gameIndex]);
}

//  countdown timer from
// https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript
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
            clearInterval(this);
        }
    }, 1000);
    return interval;
}
