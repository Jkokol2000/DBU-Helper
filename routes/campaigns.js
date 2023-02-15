const express = require('express');
const router = express.Router();
const campaignCtrl = require('../controllers/campaigns');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/campaigns', ensureLoggedIn, campaignCtrl.index)
router.get('/campaigns/new', campaignCtrl.create)
router.post('/campaigns', campaignCtrl.new)
router.get('/campaigns/:id', campaignCtrl.show)
router.delete('/campaigns/:id', campaignCtrl.delete)
router.post('/campaigns/:id/characters', campaignCtrl.addCharacter)

module.exports = router;