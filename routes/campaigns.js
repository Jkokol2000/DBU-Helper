const express = require('express');
const router = express.Router();
const campaignCtrl = require('../controllers/campaigns');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/campaigns', ensureLoggedIn, campaignCtrl.index)
router.get('/campaigns/new',ensureLoggedIn, campaignCtrl.create)
router.post('/campaigns',ensureLoggedIn, campaignCtrl.new)
router.get('/campaigns/:id',ensureLoggedIn, campaignCtrl.show)
router.delete('/campaigns/:id',ensureLoggedIn, campaignCtrl.delete)
router.post('/campaigns/:id/characters',ensureLoggedIn, campaignCtrl.addCharacter)

module.exports = router;