require("../database");
const mongoose = require("mongoose");

const { Schema } = mongoose;

let GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
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

module.exports = mongoose.model("Group", GroupSchema);
