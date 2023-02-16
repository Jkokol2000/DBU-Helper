const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    username: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const characterSchema = new Schema({
    name: {type:String,text:true},
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
    race: String,
    comments: [commentsSchema]
});

module.exports = mongoose.model('character', characterSchema);