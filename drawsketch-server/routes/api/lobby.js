const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const validator = require('validator');

const Accounts = require('../../models/accounts.js');
const auth = require('../auth');

// Constants ==========================================================
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

        this.players = [];
    };
}());

var lobbies = [];

// Helper Functions ==========================================================

var sanitizeInput = function (req, res, next) {
    if (!validator.isAlphanumeric(req.body.id)) return res.status(422).send("room id must be alphanumeric");
    if (!validator.isNumeric(req.body.timeLimit)) return res.status(422).send('room time limit must be a number');
    if (!validator.isNumeric(req.body.maxPlayers)) return res.status(422).send('room max players must be a number');
    if (!validator.isNumeric(req.body.rounds)) return res.status(422).send('room rounds must be a number');

    req.body.id = validator.escape(req.body.id);
    req.body.name = validator.escape(req.body.name);
    req.body.timeLimit = validator.escape(req.body.timeLimit);
    req.body.maxPlayers = validator.escape(req.body.maxPlayers);
    req.body.rounds = validator.escape(req.body.rounds);

    next();
}

var checkId = function (req, res, next) {
    if (!validator.isAlphanumeric(req.params.id)) return res.status(422).send('room id is invalid format');
    next();
};

// Routes ==========================================================

router.get('/', auth.required, function (req, res, next) {
    var filterIds = lobbies.map(function (room) {
        return {
            id: room.id,
            name: room.id,
            author: room.author,
            password: room.password,
            locked: room.locked,
            players: room.players.length + "/" + room.maxPlayers,
            rounds: room.rounds
        };
    });
    return res.json(filterIds);
});

//curl -X GET -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTgwZDU1NDA2ODJlMzc2YTFmYjQ2YiIsInVzZXJuYW1lIjoiYXNkIiwiZXhwIjoxNTI2NDA1Njc3LCJpYXQiOjE1MjEyMjE2Nzd9.vF69iHlQVkh4vG0iYKoeHfd5RQcC6OvFTuLASuP-ycE" -H "Content-Type: application/json" -k https://localhost:3001/api/lobby/abcde/
router.get('/:id/', auth.required, checkId, function (req, res, next) {
    var index = lobbies.findIndex(function (e) {
        return (e.id == req.params.id);
    });
    if (index === -1) {
        return res.status(409).send('room id does not exist.');
    }

    return res.json(lobbies[index]);
});

//curl -X POST -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTgwZDU1NDA2ODJlMzc2YTFmYjQ2YiIsInVzZXJuYW1lIjoiYXNkIiwiZXhwIjoxNTI2NDA1Njc3LCJpYXQiOjE1MjEyMjE2Nzd9.vF69iHlQVkh4vG0iYKoeHfd5RQcC6OvFTuLASuP-ycE" -H "Content-Type: application/json" -d '{"id": "abcd", "name": "room name", "password": "mypass", "timeLimit": "2000", "maxPlayers": "8", "rounds": "20"}' -k https://localhost:3001/api/lobby/
router.post('/', auth.required, sanitizeInput, function (req, res, next) {
    Accounts.findById(req.payload.id).then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }

        var index = lobbies.findIndex(function (e) {
            return (e.id == req.body.id);
        });
        if (index !== -1) {
            return res.status(409).send('room id already exists, please choose a unique id');
        }

        var room = new Room(req.body);
        room.author = user.username;

        lobbies.push(room);
        return res.json(room);
    }).catch(next);
});

router.post('/join/:id/', auth.required, checkId, function (req, res, next) {
    Accounts.findById(req.payload.id, userProjection).then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }

        var index = lobbies.findIndex(function (e) {
            return (e.id == req.params.id);
        });
        if (index === -1) {
            return res.status(409).send('room id does not exist.');
        }

        var room = lobbies[index];
        var index = room.players.findIndex(function (e) {
            return (e.id == req.payload.id);
        });
        if (index !== -1) {
            return res.status(409).send('already joined this lobby.');
        }

        room.players.push(user);
        res.json(room);

    }).catch(next);
});

router.post('/leave/:id/', auth.required, checkId, function (req, res, next) {
    Accounts.findById(req.payload.id, userProjection).then(function (user) {
        if (!user) {
            return res.sendStatus(401);
        }

        var index = lobbies.findIndex(function (e) {
            return (e.id == req.params.id);
        });
        if (index === -1) {
            return res.status(409).send('room id does not exist.');
        }

        var room = lobbies[index];
        var index = room.players.findIndex(function (e) {
            return (e.id == req.payload.id);
        });
        if (index === -1) {
            return res.status(409).send('user had never joined this lobby.');
        }

        room.players.splice(index, 1);
        res.json(room);

    }).catch(next);
});

module.exports = router;