require("../../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let proxySchema = new Schema(
  {
    mode: {
      type: String,
    },
    modeOfProxy: {
      type: Schema.Types.ObjectId,
      ref: "ModeOfProxys",
    },
    ip: {
      type: String,
    },
    port: {
      type: String,
    },
    userName: {
      type: String,
    },
    password: {
      type: String,
    },
    user: {
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

proxySchema.index({ label: "text" });

module.exports = mongoose.model("Proxys", proxySchema);
