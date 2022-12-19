require("../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let appSchema = new Schema(
  {
    appName: {
      type: String,
      required: true,
    },
    appIcon: {
      type: String,
    },
    appContent: {
      type: String,
    },
    createdTime: {
      type: Date,
      default: Date.now,
    },
    updatedTime: {
      type: Date,
    },
    // menuSlug: {
    //   type: String,
    //   required: true,
    // },

    // parent: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Menus",
    //   default: null,
    // },
    // children: [
    //   {
    //     type: Object,
    //   },
    // ],
    // menuOrder: {
    //   type: Number,
    //   default: 0,
    // },

    // isShow: {
    //   type: Boolean,
    //   default: true,
    // },
    // user: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Users",
    // },
  },
  { versionKey: false }
);

appSchema.index({ appName: "text" });

module.exports = mongoose.model("Apps", appSchema);
