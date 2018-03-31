const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const Accounts = require('../models/accounts.js');
const GoogleAccounts = require('../models/googleAccounts.js');
const keys = require('./keys.js');
const googleAccounts = mongoose.model('googleAccounts');
const passport = require('passport');

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  googleAccounts.findById(id).then(user => {
    return done(null, user);
  });
});

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

// https://console.developers.google.com
passport.use(new GoogleStrategy({
	clientID: keys.clientID,
	clientSecret: keys.clientSecret,
	callbackURL: '/api/user/signup/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
		// accessToken: prove to google we have access to the account
		// refreshToken: refresh the access to the acccount
    // profile: profile info
    googleAccounts.findOne({ googleId: profile.id }).then(user => {
      if (user){
        done(null, user);
      }else{
        var newUser = new googleAccounts({ 
        	googleId: profile.id, 
        	username: "", 
        	wins: 0
        });
        newUser.jwtoken = newUser.generateJWT();
        newUser.save(function(err){
          	if(err)
          		throw err;
          	return done(null, newUser)
        });  
      }
    })
	})
);