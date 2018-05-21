const express = require('express');
const passport = require('passport');
const process = require('process');
const db = require('../data');

const router = express.Router();

router.get('/', passport.authenticate('auth0', {
  clientID: 'IVDQEgKgSUPGbtZ2QKZCDFmTLHwXe61n',
  domain: 'infoshare2018.eu.auth0.com',
  redirectUri: 'http://localhost:3000/login/callback',
  audience: 'http://localhost:3000/api',
  scope: 'openid profile email mark_as_done',
  responseType: 'code'
}),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/'
}),
  (req, res) => {
    res.redirect('/');
  }
);



router.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/'
}),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
