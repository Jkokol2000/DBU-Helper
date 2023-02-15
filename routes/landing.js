const express = require('express');
const router = express.Router();
const landingCtrl = require('../controllers/landing');
const ensureLoggedIn = require('../config/ensureLoggedIn.js');

router.get('/', ensureLoggedIn, landingCtrl.index);

module.exports = router;
