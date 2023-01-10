require("../../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let versionOfOperatingSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    operating: {
      type: Schema.Types.ObjectId,
      ref: "Operatings",
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

versionOfOperatingSchema.index({ label: "text" });

module.exports = mongoose.model("versions", versionOfOperatingSchema);
