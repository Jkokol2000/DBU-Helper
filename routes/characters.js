const express = require('express');
const router = express.Router();
const charactersCtrl = require('../controllers/characters');

// GET /characters (display all characters)
router.get('/characters', charactersCtrl.index)
router.get('/characters/new', charactersCtrl.create)
router.post('/characters', charactersCtrl.new)
router.get('/characters/:id', charactersCtrl.show)
router.delete('/characters/:id', charactersCtrl.delete)
router.post('/characters/:id/comments', charactersCtrl.comment)
router.get('/search', charactersCtrl.search)

module.exports = router;