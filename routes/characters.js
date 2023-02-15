const express = require('express');
const router = express.Router();
const charactersCtrl = require('../controllers/characters');
const ensureLoggedIn = require('../config/ensureLoggedIn');
// GET /characters (display all characters)
router.get('/characters', ensureLoggedIn, charactersCtrl.index)
router.get('/characters/new',ensureLoggedIn, charactersCtrl.create)
router.post('/characters',ensureLoggedIn, charactersCtrl.new)
router.get('/characters/:id',ensureLoggedIn, charactersCtrl.show)
router.delete('/characters/:id',ensureLoggedIn, charactersCtrl.delete)
router.put('/characters/:id',ensureLoggedIn, charactersCtrl.update);
router.get('/characters/:id/edit',ensureLoggedIn, charactersCtrl.editPage)
router.post('/characters/:id/comments',ensureLoggedIn, charactersCtrl.comment)


module.exports = router;