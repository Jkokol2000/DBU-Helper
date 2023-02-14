const express = require('express');
const router = express.Router();
const campaignCtrl = require('../controllers/campaigns');

router.get('/campaigns', campaignCtrl.index)
router.get('/campaigns/new', campaignCtrl.create)
router.post('/campaigns', campaignCtrl.new)
router.get('/campaigns/:id', campaignCtrl.show)
router.delete('/campaigns/:id', campaignCtrl.delete)

module.exports = router;