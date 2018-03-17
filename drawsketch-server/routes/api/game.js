const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const validator = require('validator');

const Accounts = require('../../models/accounts.js');
const auth = require('../auth');

//curl -X GET -H "Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTcyYzk1MDkwMzk3MjA0ZDVkYTE2ZCIsInVzZXJuYW1lIjoiYXNkIiwiZXhwIjoxNTI2MDk4MDg2LCJpYXQiOjE1MjA5MTQwODZ9.eZXx6suP49sHkvNyA-spux80Kj8S1hUsoL0QABOixBA Content-Type: application/json" -k https://localhost:3001/api/game/connected/
router.get('/:id/connected/', auth.required, function(req, res, next){
  if (lobbies.includes(req.params.id)) return res.status(402).end("This room id does not exist.");

  return res.json(lobbies[req.params.id]);
});

module.exports = router;