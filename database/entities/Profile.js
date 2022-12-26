require("../database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

let profileSchema = new Schema(
  {
    name: { type: String, unique: true },
    group: {
      type: Schema.Types.ObjectId,
      ref: "groupProfile",
      default: null,
    },
    operatingSystem: {
      type: String,
      default: "1", //1: windows 2:linux
    },
    version: { type: String, default: "version default" },
    browser: { type: String, default: "browser default" },
    comment: { type: String, default: null },
    isAutoRenew: { type: Boolean, default: true },

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
      userAgent: { type: String, default: "userAgent default" },
      language: { type: String, default: "language default" },
      sizeDisplay: { type: String, default: "screenSize default" },
      core: { type: Number, default: 2 },
      hardDrive: { type: String, default: "hardDrive default" },
      ram: { type: Number, default: 2 },
      isBlockFollow: {
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
        type: String,
        default: "0",
      },
      disturbSound: { type: String, default: "disturbSound default" },
      disturbPicture: { type: String, default: "disturbPicture default" },
      webGL: { type: String, default: "webGL default" },
      //
      supplierCard: { type: String, default: "cardSupplier default" },
      card: { type: String, default: "cardScreen default" },
      websiteStarted: { type: String, default: "WebsiteStart default" },
      port: { type: String, default: "controlPort default" },
      //
      options: {
        isSaveInfoWebsite: { type: Boolean, default: true },
        isSaveExtensionInfo: { type: Boolean, default: true },
        isSaveOpeningTab: { type: Boolean, default: true },
        isSaveBookmarksBar: { type: Boolean, default: true },
        isSaveOpenedWebsite: { type: Boolean, default: true },
        isSaveEnteredPassword: { type: Boolean, default: true },
        isSaveDiary: { type: Boolean, default: true },
        isDebugMode: { type: Boolean, default: true },
        isAllowPlugins: { type: Boolean, default: true },
      },
    },
    createdTime: {
      type: Date,
      default: Date.now,
    },
    updatedTime: {
      type: Date,
    },
    durationTime: {
      type: Date,
    },
    lastTimeOpen: {
      type: Date,
      default: Date.now,
    },
    userCreated: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    status: {
      type: Boolean,
      default: false,
    },
    userId: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "Users",
        },
        role: String,
      },
    ],
    userCreated: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },

  { versionKey: false }
);
profileSchema.index({ name: "text" }, { unique: true });

module.exports = mongoose.model("Profile", profileSchema);
