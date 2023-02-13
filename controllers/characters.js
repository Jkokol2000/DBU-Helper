const Character = require('../models/characters')

module.exports = {
    index,
    new: newCharacter,
    delete: deleteCharacter,
    show,
    create
}

function index(req, res) {
    Character.find({}, function(err, characters) {
        if (err) {
            res.send(err)
        } else {
        res.render('characters/index', {title:"Characters", characters})
   }})
}

function newCharacter(req,res) {
    const newCharacter = new Character ({
        name: req.body.name,
        user: req.user.name
    });
    newCharacter.save((err, character) => {
        if (err) {
            res.send(err)
        } else {
            res.json(character);
        }
    });
}

function deleteCharacter(req, res, next) {
    // Note the cool "dot" syntax to query for a movie with a
    // review nested within an array
    Character.findOne({
      'reviews._id': req.params.id,
      'reviews.user': req.user._id
    }).then(function(character) {
      if (!character) return res.redirect('/characters');
      character.remove(req.params.id);
      character.save().then(function() {
        res.redirect(`/character/${character.id}`);
      }).catch(function(err) {
        return next(err);
      });
    });
  }

function create(req, res) {
    res.render('characters/new', {title:"Characters"});
}

function show(req,res) {
    Character.findById(req.params.id, (err, character) => {
        if (err) {
          res.send(err);
        } else {
          res.render('characters/show', { character, title:character.name });
        }
})}