require("../database");
const mongoose = require("mongoose");

const { Schema } = mongoose;

let ProfileSchema = new Schema({
  nameProfile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
    // default:''

  },
 
  userCreated: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  updatedTime: {
    type: Date,
  },
});

module.exports = mongoose.model("groupProfile", ProfileSchema);
