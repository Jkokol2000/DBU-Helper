const express = require('express');
const router = express.Router();
const charactersCtrl = require('../controllers/characters');

// GET /characters (display all characters)
router.get('/characters', charactersCtrl.index)
router.get('/characters/new', charactersCtrl.show)
router.post('/characters', charactersCtrl.new)
router.delete('/characters/:id', charactersCtrl.delete)

module.exports = router;