const express = require('express');
const router = express.Router();
const landingCtrl = require('../controllers/landing');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', landingCtrl.index);

module.exports = router;
