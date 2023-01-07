require("../../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let modeOfProxySchema = new Schema(
  {
    label: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      require: true,
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

modeOfProxySchema.index({ label: "text" });

module.exports = mongoose.model("ModeOfProxys", modeOfProxySchema);
