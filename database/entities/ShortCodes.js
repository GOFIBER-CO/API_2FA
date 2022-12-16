require('../database');
const mongoose = require('mongoose');
const { Schema } = mongoose;

let shortCodeSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    updatedTime: {
        type: Date
    },
    status: {
        type: Boolean,
        default: true
    }
}, { versionKey: false });

shortCodeSchema.index({'name': 'text'});

module.exports = mongoose.model('ShortCodes', shortCodeSchema)