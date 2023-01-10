require("../../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let operatingSchema = new Schema(
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

operatingSchema.index({ label: "text" });

module.exports = mongoose.model("Operatings", operatingSchema);
