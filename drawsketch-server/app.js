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

//https://www.namecheap.com/support/knowledgebase/article.aspx/9737/2208/pointing-a-domain-to-the-heroku-app#www.yourdomain.tld
//https://gist.github.com/Shourai/bfd9f549a41c836c99c0c660c9271df6

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
            if(found == null){
                console.log("CREATING ROOM");
                gameServer.createGame(room[1].id);
                console.log("PLAYER JOINING", room[0].username);
                gameServer.joinGame(room[0], room[1].id);
            }
            else{
                const game = gameServer.games[found]
                if(game.inGame(room[0]) == false){
                    console.log("PLAYER JOINING", room[0].username);
                    gameServer.joinGame(room[0], room[1].id);
                }
            }
        socket.join(room[1].id)
        })
        socket.on("gameState", (state) => {
            var state = JSON.parse(state);
            var updated = gameServer.setGameState(state.id, state.game)
            var game = lobbies.find((room) => room.id === state.id);
            const index = lobbies.indexOf(game);
            console.log(lobbies[index].gameState);
            lobbies[index].gameState = state.game;
            io
                .sockets
                . in(state.id)
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
