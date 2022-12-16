require("../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let schemaSchema = new Schema(
  {
    name: {
      type: String,
    },
    script: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
    page: [{ type: String }],
    createdTime: {
      type: Date,
      default: Date.now,
    },
    updatedTime: {
      type: Date,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false }
);

schemaSchema.index({ name: "text" });

module.exports = mongoose.model("Schema", schemaSchema);
