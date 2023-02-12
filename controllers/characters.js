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
        console.log(req.params.id);
        if (err) {
            res.send(err);
        } else {
            res.redirect('/characters')
        }
    })
}

function create(req, res) {
    res.render('characters/new', {title:"Characters"});
}

function show(req,res) {
    Character.findById(req.params.id, (err, character) => {
        if (err) {
          res.send(err);
        } else {
          res.render('characters/show', { character });
        }
})}