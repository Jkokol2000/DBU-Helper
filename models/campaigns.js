const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema ({
    name: String,
    code: {
        type: String,
        required: true,
        unique: true
    },
    characters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'character'
    }]
});

module.exports = mongoose.model('Campaign', campaignSchema);