require("../../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let cardOfSupplierSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Suppliers",
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

cardOfSupplierSchema.index({ label: "text" });

module.exports = mongoose.model("Cards", cardOfSupplierSchema);
