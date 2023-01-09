const Profile = require("../../database/entities/Profile");
// const Menus = require("../../database/entities/Profile");
const Users = require("../../database/entities/authentication/Users");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");
const { chromium } = require("playwright");
const { isValidObjectId, Types, Mongoose } = require("mongoose");
const puppeteer = require("puppeteer");
const listBrowser = [];
const os = require("os");
const { tmpdir } = os;
const path = require("path");
const { join, resolve, sep } = path;
const fs = require("fs");
const { existsSync, mkdirSync, promises } = fs;
const { access, unlink, writeFile, readFile } = promises;
const { FingerprintGenerator } = require("fingerprint-generator");
const { FingerprintInjector } = require("fingerprint-injector");
const { getProxyList } = require("../../helpers/getProxy");
async function createProfile(req, res) {
  // console.log(`req.body`, req.body);
  // return;
  try {
    req.body.userCreated = req.user._id;
    let profile = new Profile(req.body);

    profile.createdTime = Date.now();
    profile.updatedTime = Date.now();
    profile.lastTimeOpen = Date.now();
    // profile.userCreated = req.userId;

    //cộng 31 ngày từ khi tạo
    const date = new Date();
    date.setDate(date.getDate() + 31);
    profile.durationTime = date;

    await profile.save((err, newProfile) => {
      if (err) {
        console.log(err);
        let response = new ResponseModel(-2, err.message, err);
        res.json(response);
      } else {
        let response = new ResponseModel(
          1,
          "Create profile success!",
          newProfile
        );
        res.json(response);
      }
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function updateProfile(req, res) {
  // console.log(`req.params`, req.params);
  console.log(`body`, req.body);
  // return;

  try {
    // let newMenu = { updatedTime: Date.now(), user: req.userId, ...req.body };
    let newProfile = { updatedTime: Date.now(), ...req.body };

    let updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id },
      newProfile
    );
    if (!updatedProfile) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Update menu success!", newProfile);
      res.json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function deleteProfile(req, res) {
  // console.log(req.params);
  //   if (req.actions.includes("deleteProfile")) {
  if (isValidObjectId(req.params.id)) {
    try {
      let profile = await Profile.findByIdAndDelete(req.params.id);
      if (!profile) {
        let response = new ResponseModel(0, "No profile item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Delete profile success!", null);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res
      .status(404)
      .json(new ResponseModel(404, "Profile Id is not valid!", null));
  }
  //   } else {
  //     res.sendStatus(403);
  //   }
}
async function deleteMultiProfile(req, res) {
  try {
    let profile = await Profile.deleteMany({ _id: { $in: req.body.id } });
    if (!profile) {
      let response = new ResponseModel(0, "No profile item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Delete profile success!", null);
      res.json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function getPagingProfile(req, res) {
  // console.log(`req.userId`, req.user._id);
  const currentDate = Date.now();
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  // console.log(req.query.name);
  const searchName = req.query.name;
  let searchObj = { userCreated: req.user._id };
  if (searchName) {
    searchObj = {
      name: { $regex: ".*" + req.query.name + ".*" },
      userCreated: req.user._id,
    };
  }
  try {
    let profile = await Profile.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))

      .sort({ createdTime: "desc" });
    const status = req.query.status;
    if (status === "true") {
      profile = profile.map((item, key) => {
        if (item.durationTime.getTime() > currentDate) {
          return item;
        }
      });
    } else if (status === "false") {
      profile = profile.map((item, key) => {
        if (item.durationTime.getTime() < currentDate) {
          return item;
        }
      });
    }
    // console.log(`menus`, typeof menus[0]);
    // let arrayMenus = [];
    // console.log(menus);
    profile = profile.filter(function (element) {
      return element !== undefined;
    });

    const count = profile.length;
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, profile);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function getPagingProfileAdded(req, res) {
  // console.log(`req.userId`, req.user._id);
  const currentDate = Date.now();
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  const searchName = req.query.search;
  let searchObj = { "userId.user": req.user._id };

  if (searchName) {
    searchObj = {
      $and: [
        { "userId.user": req.user._id },
        { name: { $regex: ".*" + searchName + ".*" } },
      ],
    };
  }
  try {
    let profile = await Profile.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      //   .populate("user")

      .sort({ createdTime: "desc" });
    const status = req.query.status;
    if (status === "true") {
      profile = profile.map((item, key) => {
        if (item.durationTime.getTime() > currentDate) {
          return item;
        }
      });
    } else if (status === "false") {
      profile = profile.map((item, key) => {
        if (item.durationTime.getTime() < currentDate) {
          return item;
        }
      });
    }
    // console.log(`menus`, typeof menus[0]);
    // let arrayMenus = [];
    // console.log(menus);
    profile = profile.filter(function (element) {
      return element !== undefined;
    });

    const count = profile.length;
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, profile);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function getPagingProfileNoGroup(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  let search = req.query.search || "";
  let searchObj = {
    $and: [
      { group: null },
      { name: { $regex: ".*" + search + ".*" } },
      { userCreated: req.user._id },
    ],
  };

  try {
    let profile = await Profile.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      //   .populate("user")
      .sort({ createdTime: "desc" });
    const count = profile.length;
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, profile);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getProfileById(req, res) {
  // console.log(req.params);
  if (isValidObjectId(req.params.id)) {
    try {
      let profile = await Profile.findById(req.params.id)
        .populate("group")
        .populate("operatingSystem")
        .populate("version")
        .populate("browser")
        .populate("netWork.proxy")
        .populate("advances.language")
        .populate("advances.sizeDisplay")
        .populate("advances.core")
        .populate("advances.hardDrive")
        .populate("advances.ram")
        .populate("advances.supplierCard")
        .populate("advances.card");

      res.status(200).json({ message: "Success", profile });
    } catch (error) {
      res.status(404).json(404, error.message, error);
    }
  } else {
    res
      .status(404)
      .json(new ResponseModel(404, "Profile Id is not valid!", null));
  }
}

async function durationProfile(req, res) {
  try {
    const profile = await Profile.findById(req.params.id);
    profile.durationTime.setDate(
      profile.durationTime.getDate() + parseInt(req.body.data)
    );
    Profile.findByIdAndUpdate(req.params.id, {
      durationTime: profile.durationTime,
    }).then(() => {
      return res.status(200).json({ status: 1 });
    });
  } catch (error) {
    res.status(500).json(new ResponseModel(500, error, null));
  }
}
async function updateUserInProfile(req, res) {
  // console.log("req: ", req.body);

  // return;
  try {
    const { id, role } = req.body;

    let newUserProfile = {
      updatedTime: Date.now(),
      $addToSet: { userId: { user: id, role: role } },
    };
    let updateProfile = await Profile.updateOne(
      { _id: req.params.id },
      newUserProfile
    );
    if (!updateProfile) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(
        1,
        "Update profile success!",
        newUserProfile
      );
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function updateMultiUserInProfile(req, res) {
  try {
    const { id, role, listId } = req.body;

    let newUserProfile = {
      updatedTime: Date.now(),
      $addToSet: { userId: { user: id, role: role } },
    };
    let updateProfile = await Profile.updateOne(
      { _id: { $in: listId } },
      newUserProfile
    );
    if (!updateProfile) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(
        1,
        "Update profile success!",
        newUserProfile
      );
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function updateGroupProfile(req, res) {
  try {
    const { idGroup, listId } = req.body;
    let newUserProfile = {
      updatedTime: Date.now(),
      group: idGroup,
    };
    let updateProfile = await Profile.updateMany(
      { _id: { $in: listId } },
      newUserProfile
    );
    if (!updateProfile) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(
        1,
        "Update profile success!",
        newUserProfile
      );
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function updateUserInMultiProfile(req, res) {
  try {
    const { id, role, listId } = req.body;

    let newUserProfile = {
      updatedTime: Date.now(),
      $addToSet: { userId: { user: id, role: role } },
    };
    let updateProfile = await Profile.updateMany(
      { _id: { $in: listId } },
      newUserProfile
    );
    if (!updateProfile) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(
        1,
        "Update profile success!",
        newUserProfile
      );
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function tranferProfile(req, res) {
  try {
    const { id } = req.body;
    // console.log(id);
    let newUserProfile = {
      updatedTime: Date.now(),
      userCreated: id,
    };
    let updateProfile = await Profile.updateOne(
      { _id: req.params.id },
      newUserProfile
    );
    if (!updateProfile) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(
        1,
        "Update profile success!",
        newUserProfile
      );
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function tranferMultiProfile(req, res) {
  try {
    const { id, listId } = req.body;
    let newUserProfile = {
      updatedTime: Date.now(),
      userCreated: id,
    };
    let updateProfile = await Profile.updateMany(
      { _id: { $in: listId } },
      newUserProfile
    );
    if (!updateProfile) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(
        1,
        "Update profile success!",
        newUserProfile
      );
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function copyProfile(req, res) {
  try {
    const { quantity, property } = req.body;
    let profile = await Profile.findById(req.params.id);
    let profileList = [];
    for (let i = 1; i <= quantity; i = i + 1) {
      let copy = { ...profile?._doc };
      delete copy._id;
      copy.name = `${copy?.name} ${i}`;
      copy.userCreated = req.user?._id;
      profileList.push(copy);
    }
    Profile.insertMany(profileList, (err, profiles) => {
      if (err) {
        console.log(err);
        let response = new ResponseModel(404, err.message, err);
        res.status(404).json(response);
      } else {
        let response = new ResponseModel(1, "Copy profile success!");
        res.json(response);
      }
    });
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
function convertPreferences(preferences) {
  if (get(preferences, "navigator.userAgent")) {
    preferences.userAgent = get(preferences, "navigator.userAgent");
  }

  if (get(preferences, "navigator.doNotTrack")) {
    preferences.doNotTrack = get(preferences, "navigator.doNotTrack");
  }

  if (get(preferences, "navigator.hardwareConcurrency")) {
    preferences.hardwareConcurrency = get(
      preferences,
      "navigator.hardwareConcurrency"
    );
  }

  if (get(preferences, "navigator.language")) {
    preferences.language = get(preferences, "navigator.language");
  }

  if (get(preferences, "navigator.maxTouchPoints")) {
    preferences.navigator.max_touch_points = get(
      preferences,
      "navigator.maxTouchPoints"
    );
  }

  if (get(preferences, "isM1")) {
    preferences.is_m1 = get(preferences, "isM1");
  }

  if (get(preferences, "os") == "android") {
    const devicePixelRatio = get(preferences, "devicePixelRatio");
    const deviceScaleFactorCeil = Math.ceil(devicePixelRatio || 3.5);
    let deviceScaleFactor = devicePixelRatio;
    if (deviceScaleFactorCeil === devicePixelRatio) {
      deviceScaleFactor += 0.00000001;
    }

    preferences.mobile = {
      enable: true,
      width: parseInt(this.resolution.width, 10),
      height: parseInt(this.resolution.height, 10),
      device_scale_factor: deviceScaleFactor,
    };
  }

  preferences.mediaDevices = {
    enable: preferences.mediaDevices.enableMasking,
    videoInputs: preferences.mediaDevices.videoInputs,
    audioInputs: preferences.mediaDevices.audioInputs,
    audioOutputs: preferences.mediaDevices.audioOutputs,
  };

  return preferences;
}
const get = (value, path, defaultValue) =>
  String(path)
    .split(".")
    .reduce((acc, v) => {
      try {
        acc = acc[v] ? acc[v] : defaultValue;
      } catch (e) {
        return defaultValue;
      }

      return acc;
    }, value);
async function handleProfile(profile, preferences) {
  let proxy = get(profile, "proxy");
  const name = profile?.name;
  const chromeExtensions = get(profile, "chromeExtensions") || [];
  const userChromeExtensions = get(profile, "userChromeExtensions") || [];
  const allExtensions = [...chromeExtensions, ...userChromeExtensions];
  //extensions của brower
  // if (allExtensions.length) {
  //   const ExtensionsManagerInst = new ExtensionsManager();
  //   ExtensionsManagerInst.apiUrl = API_URL;
  //   await ExtensionsManagerInst.init()
  //     .then(() => ExtensionsManagerInst.updateExtensions())
  //     .catch(() => {});
  //   ExtensionsManagerInst.accessToken = this.access_token;

  //   await ExtensionsManagerInst.getExtensionsPolicies();
  //   let profileExtensionsCheckRes = [];

  //   if (ExtensionsManagerInst.useLocalExtStorage) {
  //     const promises = [
  //       ExtensionsManagerInst.checkChromeExtensions(allExtensions)
  //         .then((res) => ({ profileExtensionsCheckRes: res }))
  //         .catch((e) => {
  //           console.log("checkChromeExtensions error: ", e);

  //           return { profileExtensionsCheckRes: [] };
  //         }),
  //       ExtensionsManagerInst.checkLocalUserChromeExtensions(
  //         userChromeExtensions,
  //         this.profile_id
  //       )
  //         .then((res) => ({ profileUserExtensionsCheckRes: res }))
  //         .catch((error) => {
  //           console.log("checkUserChromeExtensions error: ", error);

  //           return null;
  //         }),
  //     ];

  //     const extensionsResult = await Promise.all(promises);

  //     const profileExtensionPathRes =
  //       extensionsResult.find((el) => "profileExtensionsCheckRes" in el) ||
  //       {};
  //     const profileUserExtensionPathRes = extensionsResult.find(
  //       (el) => "profileUserExtensionsCheckRes" in el
  //     );
  //     profileExtensionsCheckRes = (
  //       profileExtensionPathRes?.profileExtensionsCheckRes || []
  //     ).concat(
  //       profileUserExtensionPathRes?.profileUserExtensionsCheckRes || []
  //     );
  //   }

  //   let extSettings;
  //   if (ExtensionsManagerInst.useLocalExtStorage) {
  //     extSettings = await setExtPathsAndRemoveDeleted(
  //       preferences,
  //       profileExtensionsCheckRes,
  //       this.profile_id
  //     );
  //   } else {
  //     const originalExtensionsFolder = join(
  //       profilePath,
  //       "Default",
  //       "Extensions"
  //     );
  //     extSettings = await setOriginalExtPaths(
  //       preferences,
  //       originalExtensionsFolder
  //     );
  //   }

  //   this.extensionPathsToInstall =
  //     ExtensionsManagerInst.getExtensionsToInstall(
  //       extSettings,
  //       profileExtensionsCheckRes
  //     );

  //   if (extSettings) {
  //     const currentExtSettings = preferences.extensions || {};
  //     currentExtSettings.settings = extSettings;
  //     preferences.extensions = currentExtSettings;
  //   }
  // }
  //handle proxy
  if (proxy.mode === "gologin" || proxy.mode === "tor") {
    const autoProxyServer = get(profile, "autoProxyServer");
    const splittedAutoProxyServer = autoProxyServer.split("://");
    const splittedProxyAddress = splittedAutoProxyServer[1].split(":");
    const port = splittedProxyAddress[1];

    proxy = {
      mode: splittedAutoProxyServer[0],
      host: splittedProxyAddress[0],
      port,
      username: get(profile, "autoProxyUsername"),
      password: get(profile, "autoProxyPassword"),
    };

    profile.proxy.username = get(profile, "autoProxyUsername");
    profile.proxy.password = get(profile, "autoProxyPassword");
  }

  if (proxy.mode === "geolocation") {
    proxy.mode = "http";
  }

  if (proxy.mode === "none") {
    proxy = null;
  }

  this.proxy = proxy;
  //end
  //handle timezone
  // await this.getTimeZone(proxy).catch((e) => {
  //   console.error("Proxy Error. Check it and try again.");
  //   throw e;
  // });
  //end
  //handle location ip
  const [latitude, longitude] = this._tz.ll;
  const { accuracy } = this._tz;

  const profileGeolocation = profile.geolocation;
  const tzGeoLocation = {
    latitude,
    longitude,
    accuracy,
  };

  profile.geoLocation = this.getGeolocationParams(
    profileGeolocation,
    tzGeoLocation
  );
  //end

  //profile name
  profile.name = name;
  profile.name_base64 = Buffer.from(name).toString("base64");
  profile.profile_id = this.profile_id;
  //end
  //handle webRtc
  profile.webRtc = {
    mode:
      get(profile, "webRTC.mode") === "alerted"
        ? "public"
        : get(profile, "webRTC.mode"),
    publicIP: get(profile, "webRTC.fillBasedOnIp")
      ? this._tz.ip
      : get(profile, "webRTC.publicIp"),
    localIps: get(profile, "webRTC.localIps", []),
  };
  //end
  const audioContext = profile.audioContext || {};
  const { mode: audioCtxMode = "off", noise: audioCtxNoise } = audioContext;
  if (profile.timezone.fillBasedOnIp == false) {
    profile.timezone = { id: profile.timezone.timezone };
  } else {
    profile.timezone = { id: this._tz.timezone };
  }

  profile.webgl_noise_value = profile.webGL.noise;
  profile.get_client_rects_noise = profile.webGL.getClientRectsNoise;
  profile.canvasMode = profile.canvas.mode;
  profile.canvasNoise = profile.canvas.noise;
  profile.audioContext = {
    enable: audioCtxMode !== "off",
    noiseValue: audioCtxNoise,
  };
  profile.webgl = {
    metadata: {
      vendor: get(profile, "webGLMetadata.vendor"),
      renderer: get(profile, "webGLMetadata.renderer"),
      mode: get(profile, "webGLMetadata.mode") === "mask",
    },
  };

  profile.custom_fonts = {
    enable: !!fonts?.enableMasking,
  };

  const gologin = this.convertPreferences(profile);
  gologin.screenWidth = this.resolution.width;
  gologin.screenHeight = this.resolution.height;
  // if (this.writeCookesFromServer) {
  //   await this.writeCookiesToFile();
  // }

  // if (this.fontsMasking) {
  //   const families = fonts?.families || [];
  //   if (!families.length) {
  //     throw new Error("No fonts list provided");
  //   }

  //   try {
  //     await composeFonts(families, profilePath, this.differentOs);
  //   } catch (e) {
  //     console.trace(e);
  //   }
  // }

  const [languages] = this.language.split(";");

  if (preferences.gologin == null) {
    preferences.gologin = {};
  }

  preferences.gologin.langHeader = gologin.language;
  preferences.gologin.languages = languages;
  await writeFile(
    join(profilePath, "Default", "Preferences"),
    JSON.stringify(
      Object.assign(preferences, {
        gologin,
      })
    )
  );
  return profilePath;
}
async function startBrower(req, res) {
  try {
    const pathFolder = tmpdir();
    const listProry = getProxyList(); //day la list proxy
    const profile = await Profile.findById(req.params.id);
    const pathFile = join(pathFolder, `profile_user_${req.params.id}`);
    const browserFolderExists = await access(pathFile)
      .then(() => true)
      .catch(() => false);
    if (!browserFolderExists) {
      const fingerprintGenerator = new FingerprintGenerator();
      const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint(
        {
          devices: ["desktop"],
          browsers: ["chrome"],
        }
      );
      const { fingerprint } = browserFingerprintWithHeaders;
      const browser2 = await chromium.launchPersistentContext(pathFile, {
        userAgent: fingerprint?.navigator?.userAgent,
        locale: fingerprint.navigator.language,
        viewport: fingerprint.screen,
        headless: false,
        executablePath: "chrome-win\\chrome.exe",
      });
      browser2.close().then(async () => {
        const preferences_raw = await readFile(
          `${pathFile}\\Default\\Preferences`
        );
        const localState_raw = await readFile(`${pathFile}\\Local State`);
        const preferences = JSON.parse(preferences_raw.toString());
        const localState = JSON.parse(localState_raw.toString());
        preferences.profile.name = profile.name;
        localState.profile.info_cache.Default.name = profile.name;
        await writeFile(
          join(`${pathFile}`, "Default", "Preferences"),
          JSON.stringify(Object.assign(preferences))
        );
        await writeFile(
          join(`${pathFile}`, "Local State"),
          JSON.stringify(Object.assign(localState))
        );
        const browser = await chromium.launchPersistentContext(pathFile, {
          userAgent: fingerprint?.navigator?.userAgent,
          locale: fingerprint.navigator.language,
          viewport: fingerprint.screen,
          headless: false,
          executablePath: "chrome-win\\chrome.exe",
        });
        await browser.newPage();
        await Profile.findByIdAndUpdate(req.params.id, {
          status: true,
        });
        listBrowser.push({ id: req.params.id, browser: browser });
        res.json({ status: 1 });

        browser.on("close", async () => {
          await Profile.findByIdAndUpdate(req.params.id, {
            status: false,
          });
          const user = await Users.findById(req.user._id);
          user?.socketId.map((item) => {
            _io.to(item).emit("disconnectedBrower", req.params.id);
          });
        });
      });
    } else {
      const preferences_raw = await readFile(
        `${pathFile}\\Default\\Preferences`
      );
      const localState_raw = await readFile(`${pathFile}\\Local State`);
      const preferences = JSON.parse(preferences_raw.toString());
      const localState = JSON.parse(localState_raw.toString());
      preferences.profile.name = profile.name;
      localState.profile.info_cache.Default.name = profile.name;
      await writeFile(
        join(`${pathFile}`, "Default", "Preferences"),
        JSON.stringify(Object.assign(preferences))
      );
      await writeFile(
        join(`${pathFile}`, "Local State"),
        JSON.stringify(Object.assign(localState))
      );
      const fingerprintGenerator = new FingerprintGenerator();
      const browserFingerprintWithHeaders = fingerprintGenerator.getFingerprint(
        {
          devices: ["desktop"],
          browsers: ["chrome"],
        }
      );
      const fingerprintInjector = new FingerprintInjector();
      const { fingerprint } = browserFingerprintWithHeaders;

      const browser = await chromium.launchPersistentContext(pathFile, {
        userAgent: fingerprint?.navigator?.userAgent,
        locale: fingerprint.navigator.language,
        viewport: fingerprint.screen,
        headless: false,
        executablePath: "chrome-win\\chrome.exe",
      });

      await browser.newPage();
      await Profile.findByIdAndUpdate(req.params.id, {
        status: true,
      });
      listBrowser.push({ id: req.params.id, browser: browser });
      res.json({ status: 1 });
      browser.on("close", async () => {
        await Profile.findByIdAndUpdate(req.params.id, {
          status: false,
        });
        const user = await Users.findById(req.user._id);
        // console.log(user);
        user?.socketId.map((item) => {
          _io.to(item).emit("disconnectedBrower", req.params.id);
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json(404, error.message, error);
  }
}

async function endBrower(req, res) {
  try {
    listBrowser.map((item) => {
      if (item?.id === req.params.id) {
        item?.browser?.close();
      }
    });
    const updateProfile = await Profile.findByIdAndUpdate(req.params.id, {
      status: false,
    });
    res.json({ status: 1 });
  } catch (error) {
    // console.log(error);
    res.status(404).json(404, error.message, error);
  }
}

async function getProfileByGroup(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let menu = await Menus.find({ "overView.group": req.params.id });
      // console.log("menu", menu);
      return res.json(menu);
    } catch (error) {
      return res.status(404).json(404, error.message, error);
    }
  } else {
    return res
      .status(404)
      .json(new ResponseModel(404, "ID profile is not valid!", null));
  }
}
exports.tranferProfile = tranferProfile;
exports.createProfile = createProfile;
exports.updateProfile = updateProfile;
exports.deleteProfile = deleteProfile;
exports.getPagingProfile = getPagingProfile;
exports.copyProfile = copyProfile;
exports.getProfileById = getProfileById;
exports.getProfileByGroup = getProfileByGroup;
exports.startBrower = startBrower;
exports.endBrower = endBrower;
exports.durationProfile = durationProfile;
exports.updateUserInProfile = updateUserInProfile;
exports.getPagingProfileNoGroup = getPagingProfileNoGroup;
exports.getPagingProfileAdded = getPagingProfileAdded;
exports.deleteMultiProfile = deleteMultiProfile;
exports.updateUserInMultiProfile = updateUserInMultiProfile;
exports.updateGroupProfile = updateGroupProfile;
exports.updateMultiUserInProfile = updateMultiUserInProfile;
exports.tranferMultiProfile = tranferMultiProfile;
