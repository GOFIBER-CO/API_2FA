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
      type: Schema.Types.ObjectId,
      ref: "Operatings",
      default: null,
    },
    version: {
      type: Schema.Types.ObjectId,
      ref: "versions",
      default: null,
    },
    browser: {
      type: Schema.Types.ObjectId,
      ref: "Browsers",
      default: null,
    },
    comment: { type: String, default: null },
    isAutoRenew: { type: Boolean, default: true },

    netWork: {
      proxy: {
        type: Schema.Types.ObjectId,
        ref: "ModeOfProxys",
        default: null,
      },
      ipOfProxy: {
        type: String,
        default: "",
      },
      portOfProxy: {
        type: String,
        default: "",
      },
      usernameOfProxy: {
        type: String,
        default: "",
      },
      passwordOfProxy: {
        type: String,
        default: "",
      },
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
      language: {
        type: Schema.Types.ObjectId,
        ref: "Languages",
        default: null,
      },
      sizeDisplay: {
        type: Schema.Types.ObjectId,
        ref: "Displays",
        default: null,
      },
      core: {
        type: Schema.Types.ObjectId,
        ref: "Cores",
        default: null,
      },
      hardDrive: {
        type: Schema.Types.ObjectId,
        ref: "HardDrives",
        default: null,
      },
      ram: {
        type: Schema.Types.ObjectId,
        ref: "Rams",
        default: null,
      },
      isBlockFollow: {
        type: Boolean,
        default: true,
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
      supplierCard: {
        type: Schema.Types.ObjectId,
        ref: "Suppliers",
        default: null,
      },
      card: {
        type: Schema.Types.ObjectId,
        ref: "Cards",
        default: null,
      },
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

module.exports = mongoose.model("Profile", profileSchema);
