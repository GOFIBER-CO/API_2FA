require("../database");
const mongoose = require("mongoose");

const { Schema } = mongoose;

let SecretSchema = new Schema(
  {
    secret: {
      type: String,
    },
    userId: {
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
  },
  { versionKey: false }
);

SecretSchema.index({ logName: "text" });

module.exports = mongoose.model("Secret", SecretSchema);
