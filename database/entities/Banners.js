require('../database');
const mongoose = require('mongoose');
const { Schema } = mongoose;

let bannerSchema = new Schema({
    imageUrl:{
        type: String,
        required: true
    },
    imageOrder: {
        type: Number,
        default: 0
    },
    link:{
        type: String
    },
    position: {
        type: String
    },
    isShow: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('Banners', bannerSchema)