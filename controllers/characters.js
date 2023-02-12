const Character = require('../models/characters')

module.exports = {
    index,
    new: newCharacter,
    delete: deleteCharacter,
    show
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
    });
    newCharacter.save((err, character) => {
        if (err) {
            res.send(err)
        } else {
            res.json(character);
        }
    });
}

function deleteCharacter(req,res) {
    Character.deleteOne({_id: req.params.id}, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/characters')
        }
    })
}

function show(req, res) {
    res.render('characters/new', {title:"Characters"});
}