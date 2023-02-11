const Character = require('../models/characters')

module.exports = {
    index
}

function index(req, res) {
    Character.find({}, function(err, characters) {
        res.render('main/characters', {title:"Characters", characters})
    })
}