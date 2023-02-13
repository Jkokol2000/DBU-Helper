const Character = require('../models/characters')
const user = require('../models/user')
const User = require('../models/user')

module.exports = {
    index,
    new: newCharacter,
    delete: deleteCharacter,
    show,
    create
}

function index(req, res) {
    const user = req.user
    Character.find({user}, function(err, characters) {
        if (err) {
            res.send(err)
        } else {
        res.render('characters/index', {title:"Characters", characters})
   }})
}

function newCharacter(req,res) {
    if (req.user) {
        User.findOne({ googleId: req.user.googleId}, (err, user) => {
            if (err) {
                return res.status(500).send({ message: 'Error finding user'});
            }
            const character = new Character({
                name: req.body.name,
                user: user._id
            });
            character.save((err) => {
                if (err) {
                    return res.status(500).send({ message: 'Error Saving character'});
                }
                res.redirect('/characters')
            });
        });
    } else {
        res.status(401).send({message: 'Not authorized'});
    }
}
function deleteCharacter(req, res) {
    Character.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/characters');
        }
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
            let isUserAuthorized = false;
            if (req.user && req.user._id.equals(character.user)){
                isUserAuthorized = true;
            }
            res.render('characters/show', {
                character,
                title: character.name,
                isUserAuthorized
            });
        }
})
}