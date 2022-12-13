const mongoose = require("mongoose");

const RefreshToken = mongoose.Schema({
  refreshToken: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("refreshtoken", RefreshToken);
