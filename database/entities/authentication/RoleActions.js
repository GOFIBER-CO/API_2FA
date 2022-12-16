require('../../database');
const mongoose = require('mongoose');

const { Schema } = mongoose;

let roleActionsSchema = new Schema({
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Roles',
        required: true
    },
    action: {
        type: Schema.Types.ObjectId,
        ref: 'Actions',
        required: true
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    updatedTime: {
        type: Date
    }
}, { versionKey: false });

module.exports = mongoose.model('RoleActions', roleActionsSchema)
