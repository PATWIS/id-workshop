const express = require('express');

const router = express.Router();


const passport = require('passport');

router.get('/', (req, res, next) => {
  res.render('login', { user: req.user });
});

//...
router.post('/', passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;
