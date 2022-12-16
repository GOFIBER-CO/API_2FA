require("../database");
const mongoose = require("mongoose");

const { Schema } = mongoose;

let SecretSchema = new Schema({
  secret: {
    type: String,
    unique: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    unique: true,
    index: true,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  updatedTime: {
    type: Date,
  },
});
SecretSchema.index({ secret: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Secret", SecretSchema);
