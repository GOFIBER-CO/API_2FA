require("../../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let DisplaySchema = new Schema(
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

DisplaySchema.index({ label: "text" });

module.exports = mongoose.model("Displays", DisplaySchema);
