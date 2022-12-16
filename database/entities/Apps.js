require("../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let appSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    video: {
      type: String,
    },
    menuOrder: {
      type: Number,
      default: 0,
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
