require("../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let appSchema = new Schema(
  {
    appName: {
      type: String,
      required: true,
    },
    appSlug: {
      type: String,
      required: true,
    },
    appIcon: {
      type: String,
    },
    content: {
      type: String,
    },
    createdTime: {
      type: Date,
      default: Date.now,
    },
    updatedTime: {
      type: Date,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Apps", appSchema);
