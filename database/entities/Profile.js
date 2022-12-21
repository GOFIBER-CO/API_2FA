require("../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let profileSchema = new Schema(
  {
    overView: {
      name: String,
      group: {
        //   type: Schema.Types.ObjectId,
        type: String,
        ref: "Group",
        default: null,
      },
      operatingSystem: {
        type: String,
        default: "1", //1: windows 2:linux
      },
      version: { type: String, default: "version default" },
      browser: { type: String, default: "browser default" },
      comment: { type: String, default: null },
      autoRenew: { type: Boolean, default: true },
    },
    netWork: {
      proxy: { type: String, default: "proxy default" },
      timeZone: { type: String, default: "timeZone default" },
      fakeLocation: { type: String, default: "fakeLocation default" },
      customDNS: { type: String, default: "customDNS default" },
      webRTC: {
        ipUsing: { type: String, default: "ipUsing default" },
        ipLan: { type: String, default: "ipLan default" },
        ipWan: { type: String, default: "ipWan default" },
      },
    },

    // browser: { type: String, default: "browser default" },
    advances: {
      language: { type: String, default: "language default" },
      sizeDisplay: { type: String, default: "screenSize default" },
      core: { type: Number, default: 2 },
      hardDrive: { type: String, default: "hardDrive default" },
      ram: { type: Number, default: 2 },
      follow: {
        type: Boolean,
        default: false,
      },
      numberDisplay: { type: Number, default: 2 },
      numberMicro: {
        type: Number,
        default: 2,
      },
      numberSpeaker: {
        type: Number,
        default: 2,
      },
      //
      canvas: {
        type: Number,
        default: 0,
      },
      disturbSound: {
        type: Boolean,
        default: false,
      },
      disturbPicture: {
        type: Boolean,
        default: false,
      },
      webGL: {
        type: Boolean,
        default: false,
      },
      //
      supplierCard: { type: String, default: "cardSupplier default" },
      card: { type: String, default: "cardScreen default" },
      //
      options: {
        saveInfoWebsite: { type: Boolean, default: true },
        saveExtensionInfo: { type: Boolean, default: true },
        saveOpeningTab: { type: Boolean, default: true },
        saveBookmarksBar: { type: Boolean, default: true },
        saveOpenedWebsite: { type: Boolean, default: true },
        saveEnteredPassword: { type: Boolean, default: true },
        saveDiary: { type: Boolean, default: true },
        debugMode: { type: Boolean, default: true },
        allowPlugins: { type: Boolean, default: true },
      },
      //
      websiteStarted: { type: String, default: "WebsiteStart default" },
      controlPort: { type: String, default: "controlPort default" },
      //
    },
    createdTime: {
      type: Date,
      default: Date.now,
    },
    updatedTime: {
      type: Date,
    },
    // hardWare: { type: String, default: "ramNumber default" },
  },

  { versionKey: false }
);

profileSchema.index({ name: "text" });

module.exports = mongoose.model("Profile", profileSchema);
