const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../data');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('signup', { user: req.user });
});

router.post('/', (req, res, next) => {
  if (!req.body.login) {
    return next(new Error('Login is missing'));
  }
  if (!req.body.password) {
    return next(new Error('Password is missing'));
  }
  if (req.body.password !== req.body.confirm_password) {
    return next(new Error('Passwords don\'t match'));
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      db.register(req.body.login, hash, (err, ok) => {
        if (err) {
          return next(err);
        }
        if (!ok) {
          return next(new Error(`User ${req.body.login} already exists`));
        }
        
        res.redirect('/');
      });
    });
  });
});


module.exports = router;
