const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

const mongoose = require('mongoose');
const Accounts = require('../models/accounts.js');
const GoogleAccounts = require('../models/googleAccounts.js');

const keys = require('./keys.js');

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]'
}, function(username, password, done) {
  Accounts.findOne({username: username}).then(function(user){
    if(!user || !user.validPassword(password)){
      return done(null, false, {errors: {'username or password': 'is invalid'}});
    }

    return done(null, user);
  }).catch(done);
}));
