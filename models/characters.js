const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema ({
    name: String
});

 module.exports = mongoose.model('character', characterSchema);