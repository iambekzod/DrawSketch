var jwt = require('jsonwebtoken');
var secret = require('../config/keys.js').jwtSecret;
var crypto = require('crypto');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
// var { Schema } = mongoose; is equivalent 
var Schema = mongoose.Schema;

// create a schema
var googleAccountsSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  username: String,
  wins: Number,
}, {timestamps: true});

googleAccountsSchema.plugin(uniqueValidator, {message: 'expected {PATH} to be unique'});

// implement?
googleAccountsSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    google: true,
    id: this.googleId,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, secret);
};

googleAccountsSchema.methods.setUsername = function (username) {
  this.username = username;
};


googleAccountsSchema.methods.toAuthJSON = function () {
  return {
    googleId: this.googleId,
    username: this.username,
    wins: this.wins,
    token: this.generateJWT()
  };
};

var GoogleAccounts = mongoose.model('googleAccounts', googleAccountsSchema);

module.exports = GoogleAccounts;