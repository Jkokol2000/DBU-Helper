const express = require('express');
const router = express.Router();
const charactersCtrl = require('../controllers/characters');

// GET /characters (display all characters)
router.get('/characters', charactersCtrl.index)

module.exports = router;