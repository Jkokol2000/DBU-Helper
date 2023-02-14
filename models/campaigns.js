const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
    name: String,
    creator: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    description: String,
    characters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'character'
    }]
});

module.exports = mongoose.model('Campaign', campaignSchema);