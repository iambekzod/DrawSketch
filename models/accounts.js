var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const lobbies = require('../routes/api/rooms.js');

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
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  salt: {
    type: String,
  },
  googleId: String,
  wins: Number
}, {
  timestamps: true
});

accountsSchema.plugin(uniqueValidator, {
  message: 'expected {PATH} to be unique'
});

function generateHash(password, salt) {
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('base64');
}

accountsSchema.methods.validPassword = function (password) {
  if (this.password == null || this.salt == null) return false;

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
  }, process.env.JWT_SECRET);
};

accountsSchema.methods.toAuthJSON = function () {
  var self = this;
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    wins: this.wins,
    room: lobbies.find(function (lobby) {
      var found = lobby.players.find(function (user) {
        return user.username === self.username;
      });
      if (found) return lobby;
    }),
    token: this.generateJWT()
  };
};

var Accounts = mongoose.model('accounts', accountsSchema);

module.exports = Accounts;