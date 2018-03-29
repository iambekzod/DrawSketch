var jwt = require('jsonwebtoken');
var secret = require('../config/keys.js').jwtSecret;
var crypto = require('crypto');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// create a schema
var accountsSchema = new Schema({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  salt: {
    type: String,
    required: true
  },
  wins: Number
}, {timestamps: true});

accountsSchema.plugin(uniqueValidator, {message: 'expected {PATH} to be unique'});

function generateHash(password, salt) {
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('base64');
}

accountsSchema.methods.validPassword = function (password) {
  return this.password === generateHash(password, this.salt);
};

accountsSchema.methods.setPassword = function (password) {
  this.salt = crypto
    .randomBytes(16)
    .toString('base64');
  this.password = generateHash(password, this.salt);
};

accountsSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, secret);
};

accountsSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    firstname: this.firstname,
    lastname: this.lastname,
    password: this.password,
    wins: this.wins,
    email: this.email,
    token: this.generateJWT()
  };
};

var Accounts = mongoose.model('accounts', accountsSchema);

module.exports = Accounts;