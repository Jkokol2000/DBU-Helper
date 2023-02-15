var express = require('express');
var router = express.Router();
const passport = require('passport');
const ensureLoggedIn = require('../config/ensureLoggedIn');

/* GET home page. */
router.get('/home', ensureLoggedIn, function (req, res, next) {
  res.render('main/home', { title: 'Home' });
});
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('main/home');
  } else {
  res.render('main/landing', { title: 'Welcome!' });
}});
router.get('/auth/google', passport.authenticate(
  // Which passport strategy is being used?
  'google',
  {
    // Requesting the user's profile and email
    scope: ['profile', 'email'],
    // Optionally force pick account every time
    prompt: "select_account"
  }
));
/* GET character page */


router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/home',
    failureRedirect: '/'
  }
));
router.get('/logout', function (req, res) {
  req.logout(function () {
    res.redirect('/');
  });
});

module.exports = router;
