const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const validator = require('validator');

const Accounts = require('../../models/accounts.js');
const auth = require('../auth');

var sanitizeInput = function (req, res, next) {
  if (!validator.isAlpha(req.body.user.firstname)) return res.status(422).json({errors: {Firstname: "must contain only letters"}});
  if (!validator.isAlpha(req.body.user.lastname)) return res.status(422).json({errors: {Lastname: "must contain only letters"}});
  if (!validator.isEmail(req.body.user.email)) return res.status(422).json({errors: {Email: "must be of proper email format"}});
  if (req.body.user.password !== req.body.user.confirmPassword) return res.status(401).json({errors: {Passwords: " do not match"}});

  req.body.user.username = validator.escape(req.body.user.username);
  req.body.user.firstname = validator.escape(req.body.user.firstname);
  req.body.user.lastname = validator.escape(req.body.user.lastname);
  req.body.user.email = validator.escape(req.body.user.email);
  req.body.user.password = validator.escape(req.body.user.password);
  req.body.user.confirmPassword = validator.escape(req.body.user.confirmPassword);

  next();
}

router.get('/', auth.required, function(req, res, next) {
  Accounts.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    return res.json(user.toAuthJSON());
  }).catch(next);
});

router.put('/update', auth.required, function(req, res, next){
  Accounts.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(req.body.email){
      user.email = req.body.email;
    }
    if(req.body.password){
      user.setPassword(req.body.user.password);
    }
    if(req.body.winner){
      user.wins += 1;
    }

    return user.save().then(function(){
      return res.json(user.toAuthJSON());
    });
  }).catch(next);
});

router.post('/signin', function(req, res, next) {
  req.body.user.username = validator.escape(req.body.user.username);
  req.body.user.password = validator.escape(req.body.user.password);  

  if(!req.body.user.username){
    return res.status(422).json({errors: {username: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json(user.toAuthJSON());
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/signup', sanitizeInput, function(req, res, next) {
  var newUser = Accounts({
    username: req.body.user.username,
    firstname: req.body.user.firstname,
    lastname: req.body.user.lastname,
    email: req.body.user.email,
    wins: 0,
  });
  newUser.setPassword(req.body.user.password);
  newUser.save(function (err) {
      if (err) {
        if (err.errors["username"]) return res.status(422).json({errors: { Username: "is taken" }});
        if (err.errors["email"]) return res.status(422).json({errors: { Email: "is being used by another user" }});

        return res.status(422).json({errors: { error: err.message }}); // Fall back, to always return soemthing
      } else return res.json(newUser.toAuthJSON());
  });
});

module.exports = router;