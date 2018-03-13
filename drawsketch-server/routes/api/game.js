const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const validator = require('validator');

const Accounts = require('../../models/accounts.js');
const auth = require('../auth');

//curl -X GET -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkYTE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZXhwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHkvNyA-spux80Kj8S1hUsoL0QABOixBA Content-Type: application/json" -k https://localhost:3001/api/game/connected/
router.get('/connected/', auth.required, function(req, res, next){
  res.end("return the connected players to this lobby")
});

module.exports = router;