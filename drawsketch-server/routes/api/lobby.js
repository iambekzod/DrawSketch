const mongoose = require('mongoose');
const router = require('express').Router();
const validator = require('validator');
const uuid = require('uuid/v4');
const Accounts = require('../../models/accounts.js');
const auth = require('../auth');

const game = require('./gameServer')

// Constants ========================================================== Prevent
// sensitive information from being dumped out
var userProjection = {
    salt: 0,
    password: 0,
    createdAt: 0,
    updatedAt: 0,
    __v: 0
};

var Room = (function () {
    return function room(request) {
        this.id = request.id;
        this.name = request.name;
        this.author = request.author;
        this.password = request.password;
        this.locked = request.password !== "";
        this.timeLimit = request.timeLimit; // Use: Milliseconds
        this.maxPlayers = request.maxPlayers;
        this.rounds = request.rounds;
        this.drawer = ""
        this.players = [];
    };
}());

var lobbies = [];

// Helper Functions ==========================================================

var sanitizeInput = function (req, res, next) {
    if (!validator.isNumeric(req.body.maxPlayers)) 
        return res.status(422).json({
            errors: {
                MaxPlayers: "must be numeric"
            }
        });
    if (!validator.isNumeric(req.body.rounds)) 
        return res.status(422).json({
            errors: {
                Rounds: "must be numeric"
            }
        });
    if (req.body.name === "") 
        return res.status(422).json({
            errors: {
                RoomName: "must be non empty"
            }
        });
    
    req.body.name = validator.escape(req.body.name);
    switch (req.body.timeLimit) {
        case "0:30":
            req.body.timeLimit = 30000;
            break;
        case "1:00":
            req.body.timeLimit = 60000;
            break;
        case "1:30":
            req.body.timeLimit = 90000;
            break;
        case "2:00":
            req.body.timeLimit = 120000;
            break;
        case "2:30":
            req.body.timeLimit = 150000;
            break;
        case "3:00":
            req.body.timeLimit = 180000;
            break;
        default:
            return res
                .status(422)
                .json({
                    errors: {
                        TimeLimit: "must be of format: X:XX from 0:30 and 3:00"
                    }
                });
            break;
    }
    req.body.password = validator.escape(req.body.password);
    req.body.maxPlayers = validator.escape(req.body.maxPlayers);
    req.body.rounds = validator.escape(req.body.rounds);

    next();
}

var checkId = function (req, res, next) {
    if (!validator.isUUID(req.params.id)) 
        return res.status(422).json({
            errors: {
                RoomId: "must be alphanumeric"
            }
        });
    next();
};

// Routes ==========================================================

router.get('/', auth.required, function (req, res, next) {
    var filterIds = lobbies.map(function (room) {
        return {
            id: room.id,
            name: room.name,
            author: room.author,
            password: room.password,
            locked: room.locked,
            players: room.players.length + "/" + room.maxPlayers,
            rounds: room.rounds
        };
    });
    return res.json(filterIds.slice(0, 10));
});

// curl -X GET -H "Authorization: Token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTgwZDU1NDA2ODJlMzc2YTFmYjQ2
// Y
// iIsInVzZXJuYW1lIjoiYXNkIiwiZXhwIjoxNTI2NDA1Njc3LCJpYXQiOjE1MjEyMjE2Nzd9.vF69i
// H lQVkh4vG0iYKoeHfd5RQcC6OvFTuLASuP-ycE" -H "Content-Type: application/json"
// -k https://localhost:3001/api/lobby/abcde/
router.get('/:id/', auth.required, checkId, function (req, res, next) {
    var index = lobbies.findIndex(function (e) {
        return (e.id == req.params.id);
    });
    if (index === -1) {
        return res
            .status(409)
            .json({
                errors: {
                    RoomId: "does not exist"
                }
            });
    }

    return res.json(lobbies[index]);
});

// curl -X POST -H "Authorization: Token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTgwZDU1NDA2ODJlMzc2YTFmYjQ2
// Y
// iIsInVzZXJuYW1lIjoiYXNkIiwiZXhwIjoxNTI2NDA1Njc3LCJpYXQiOjE1MjEyMjE2Nzd9.vF69i
// H lQVkh4vG0iYKoeHfd5RQcC6OvFTuLASuP-ycE" -H "Content-Type: application/json"
// -d '{"id": "abcd", "name": "room name", "password": "mypass", "timeLimit":
// "2000", "maxPlayers": "8", "rounds": "20"}' -k
// https://localhost:3001/api/lobby/
router.post('/', auth.required, sanitizeInput, function (req, res, next) {
    Accounts
        .findById(req.payload.id)
        .then(function (user) {
            if (!user) {
                return res.sendStatus(401);
            }

            var index = lobbies.findIndex(function (e) {
                return (e.name == req.body.name);
            });
            if (index !== -1) {
                return res
                    .status(409)
                    .json({
                        errors: {
                            RoomName: "already exists"
                        }
                    });
            }

            var room = new Room(req.body);
            room.id = uuid();
            room.author = user.username;

            lobbies.push(room);
            game.Begin(room);
            return res.json(room);
        })
        .catch(next);
});

router.post('/join/:id/', auth.required, checkId, function (req, res, next) {
    Accounts
        .findById(req.payload.id, userProjection)
        .then(function (user) {
            if (!user) {
                return res.sendStatus(401);
            }

            var index = lobbies.findIndex(function (e) {
                return (e.id == req.params.id);
            });
            if (index === -1) {
                return res
                    .status(409)
                    .json({
                        errors: {
                            RoomId: "does not exist"
                        }
                    });
            }

            var room = lobbies[index];
            if (room.players.length === room.maxPlayers) {
                return res
                    .status(409)
                    .json({
                        errors: {
                            This: " room is full"
                        }
                    });
            }
            index = room
                .players
                .findIndex(function (e) {
                    return (e.id == req.payload.id);
                });
            if (index !== -1) {
                return res
                    .status(409)
                    .json({
                        errors: {
                            User: "already joined this lobby"
                        }
                    });
            }

            if (room.locked) {
                req.body.password = validator.escape(req.body.password);
                if (room.password !== req.body.password) {
                    return res
                        .status(409)
                        .json({
                            errors: {
                                Invalid: "password for joining this lobby"
                            }
                        });
                }
            }
            if (room.players.length == 0) {
                room.drawer = user;
            }
            room
                .players
                .push(user);
            res.json(room);
        })
        .catch(next);
});

router.post('/leave/:id/', auth.required, checkId, function (req, res, next) {
    Accounts
        .findById(req.payload.id, userProjection)
        .then(function (user) {
            if (!user) {
                return res.sendStatus(401);
            }

            var index = lobbies.findIndex(function (e) {
                return (e.id == req.params.id);
            });
            if (index === -1) {
                return res
                    .status(409)
                    .json({
                        errors: {
                            RoomId: "does not exist"
                        }
                    });
            }

            var room = lobbies[index];
            var index = room
                .players
                .findIndex(function (e) {
                    return (e.id == req.payload.id);
                });
            if (index === -1) {
                return res
                    .status(409)
                    .json({
                        errors: {
                            User: "is not in this lobby"
                        }
                    });
            }

            room
                .players
                .splice(index, 1);
            res.json(room);

        })
        .catch(next);
});

module.exports = router;