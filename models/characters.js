const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema ({
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stats: {
        lifePoints: {
            type: Number,
            default: 0
        },
        agility: {
            type: Number,
            default: 2
        },
        force: {
            type: Number,
            default: 2
        },
        tenacity: {
            type: Number,
            default: 2
        },
        scholarship: {
            type: Number,
            default: 2
        },
        insight: {
            type: Number,
            default: 2
        },
        spirit: {
            type: Number,
            default: 2
        },
        personality: {
            type: Number,
            default: 2
        }
    },
    race: String
});

 module.exports = mongoose.model('character', characterSchema);