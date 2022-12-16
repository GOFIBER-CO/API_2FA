require('../database');
const mongoose = require('mongoose');
const { Schema } = mongoose;

let categorySchema = new Schema({
    categoryName:{
        type: String,
        required: true,
        unique: true
    },
    categorySlug: {
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

categorySchema.index({'categoryName': 'text'});

module.exports = mongoose.model('Categories', categorySchema)