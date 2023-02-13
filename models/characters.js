const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema ({
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

 module.exports = mongoose.model('character', characterSchema);