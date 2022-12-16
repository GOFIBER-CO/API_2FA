require("../database");
const mongoose = require("mongoose");

const { Schema } = mongoose;

let ExportSchema = new Schema(
  {
    secret: [
      {
        type: String,
      },
    ],
    userId: {
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

ExportSchema.index({ logName: "text" });

module.exports = mongoose.model("Export", ExportSchema);
