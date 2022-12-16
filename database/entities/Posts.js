require('../database');
const mongoose = require('mongoose');
const { Schema } = mongoose;

let postSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    thumb:{
        type: String
    },
    content: {
        type: String
    },
    menu: {
        type: Schema.Types.ObjectId,
        ref: 'Menus'
    },
    // category: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Categories'
    // },
    tags:[{
        type: Schema.Types.ObjectId,
        ref: 'Tags'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    numberOfReader:{
        type: Number,
        default: 0
    },
    status:{
        type: Number,
        default: 1
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    updatedTime: {
        type: Date
    }
}, { versionKey: false });

postSchema.index({'title': 'text'});

module.exports = mongoose.model('Posts', postSchema)