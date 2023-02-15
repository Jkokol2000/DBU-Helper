const express = require('express');
const router = express.Router();
const charactersCtrl = require('../controllers/characters');
const ensureLoggedIn = require('../config/ensureLoggedIn');
// GET /characters (display all characters)
router.get('/characters', ensureLoggedIn, charactersCtrl.index)
router.get('/characters/new', charactersCtrl.create)
router.post('/characters', charactersCtrl.new)
router.get('/characters/:id', charactersCtrl.show)
router.delete('/characters/:id', charactersCtrl.delete)
router.put('/characters/:id', charactersCtrl.update);
router.get('/characters/:id/edit', charactersCtrl.editPage)
router.post('/characters/:id/comments', charactersCtrl.comment)


module.exports = router;