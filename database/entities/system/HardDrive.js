require("../../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let hardDriveSchema = new Schema(
  {
    label: {
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

hardDriveSchema.index({ label: "text" });

module.exports = mongoose.model("HardDrives", hardDriveSchema);
