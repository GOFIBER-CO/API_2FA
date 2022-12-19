require("../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let feedbackSchema = new Schema(
  {
    feedbackName: {
      type: String,
    },
    feedbackContent: {
      type: String,
    },
    feedbackRate: {
      type: Number,
      default: 5,
    },
    createdTime: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

feedbackSchema.index({ feedbackSchema: "text" });

module.exports = mongoose.model("feedback", feedbackSchema);
