// grab the things we need
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

// the schema is useless so far
// we need to create a model using it
var Accounts = mongoose.model('accounts', accountsSchema);

// make this available to our users in our Node applications
module.exports = Accounts;