const mongoose = require('mongoose');
const router = require('express').Router();
const validator = require('validator');
const uuid = require('uuid/v4');
const Accounts = require('../../models/accounts.js');
const auth = require('../auth');
const server = require('../../app.js');
const lobbies = require('./rooms.js');

// Constants ========================================================== Prevent
// sensitive information from being dumped out

var Room = (function () {
    return function room(request) {
        this.name = request.name;
        this.author = request.author;
        this.password = request.password;
        this.locked = request.password !== "";
        this.timeLimit = request.timeLimit; // Use: seconds
        this.maxPlayers = parseInt(request.maxPlayers);
        this.rounds = parseInt(request.rounds);
        this.players = [];
        this.started = false;
        this.gameState = {
                isPainting: false,
                xPos: [],
                yPos: [],
                width: [],
                dragging: [],
                paintColor: [],
                curWidth: 2,
                curColor: "black"
            },
            this.timeElapsed = "";
        this.roundsPlayed = 0;
    };
}());

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
            req.body.timeLimit = 30;
            break;
        case "1:00":
            req.body.timeLimit = 60;
            break;
        case "1:30":
            req.body.timeLimit = 90;
            break;
        case "2:00":
            req.body.timeLimit = 120;
            break;
        case "2:30":
            req.body.timeLimit = 150;
            break;
        case "3:00":
            req.body.timeLimit = 180;
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

    numRounds = parseInt(req.body.rounds);
    if (numRounds < 4 || numRounds > 16) {
        return res.status(422).json({
            errors: {
                rounds: "must be between 4 and 16 rounds"
            }
        });
    }

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
    return res.json(filterIds);
});

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
            return res.json(room);
        })
        .catch(next);
});

router.post('/join/:id/', auth.required, checkId, function (req, res, next) {
    Accounts
        .findById(req.payload.id)
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
            user = user.toAuthJSON();
            if (user.room) return res.status(409)
                .json({
                    errors: {
                        User: "has already joined one lobby"
                    }
                });

            if (room.locked) {
                if (!req.body.password) {
                    return res.status(422).json({
                        errors: {
                            password: "can't be blank"
                        }
                    });
                }

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
        .findById(req.payload.id)
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