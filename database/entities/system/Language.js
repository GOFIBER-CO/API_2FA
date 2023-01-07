require("../../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let languageSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
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

languageSchema.index({ label: "text" });

module.exports = mongoose.model("Languages", languageSchema);
