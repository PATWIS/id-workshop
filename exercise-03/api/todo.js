const express = require('express');
const passport = require('passport');
const _ = require('lodash');
const db = require('../data');

const router = express.Router();



router.post('/done', passport.authenticate('bearer', { session: false }), (req, res) => {
  if (typeof req.body.id !== 'number') {
    res.status(400);
    return res.end('Bad request');
  }
  const access_token = req.user;
  if (!_.includes(access_token.aud, 'http://localhost:3000/api')) {
    res.status(401);
    return res.end('Bad token');
  }

  const scopes = access_token.scope.split(' ');
  if (!_.includes(scopes, 'mark_as_done')) {
    res.status(401);
    return res.end('Insufficient privileges');
  }

  const now = Math.floor(Date.now() / 1000);
  if (!access_token.exp || now > access_token.exp) {
    res.status(401);
    return res.end('Token expired');
  }

  db.done(req.user.sub, req.body.id, (err) => {
    if (err) {
      res.status(400);
      return res.end(err);
    }

    res.status(200);
    res.end('OK');
  });
});

module.exports = router;
