require("../../database");
const mongoose = require("mongoose");

const { Schema } = mongoose;

let userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    createdTime: {
      type: Date,
      default: Date.now,
    },
    updatedTime: {
      type: Date,
    },
    role: { type: Schema.Types.ObjectId, ref: "Roles" },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Users", userSchema);
