var jwt = require('jsonwebtoken');
var secret = require('../keys.js').jwtSecret;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var accountsSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String },
  points: Number,
});

accountsSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

accountsSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  };
};

// the schema is useless so far
// we need to create a model using it
var Accounts = mongoose.model('accounts', accountsSchema);

// make this available to our users in our Node applications
module.exports = Accounts;