require('../database');
const mongoose = require('mongoose');
const { Schema } = mongoose;

let tagSchema = new Schema({
    tagName:{
        type: String,
        required: true,
        unique: true
    },
    tagSlug: {
        type: String,
        required: true,
        unique: true
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
    }
}, { versionKey: false });

tagSchema.index({'tagName': 'text'});

module.exports = mongoose.model('Tags', tagSchema)