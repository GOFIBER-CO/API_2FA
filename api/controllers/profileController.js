const Profile = require("../../database/entities/Profile");
// const Menus = require("../../database/entities/Profile");
const Users = require("../../database/entities/authentication/Users");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");
const { isValidObjectId, Types, Mongoose } = require("mongoose");
const puppeteer = require("puppeteer");
const listBrowser = [];
async function createProfile(req, res) {
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
  // console.log(`body`, req.body.data);
  // return
  // if (req.actions.includes("updateProfile")) {
  try {
    // let newMenu = { updatedTime: Date.now(), user: req.userId, ...req.body };
    let newProfile = { updatedTime: Date.now(), ...req.body.data };

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
  // } else {
  //   res.sendStatus(403);
  // }
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
    console.log(profile);
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
      { group: "" },
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
      let profile = await Profile.findById(req.params.id);
      res.json(profile);
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

async function tranferProfile(req, res) {
  try {
    const { id } = req.body;
    console.log(id);
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
    // let updateProfile = await Menus.updateOne(
    //   { _id: req.params.id },
    //   newUserProfile
    // );
    // if (!updateProfile) {
    //   let response = new ResponseModel(0, "No item found!", null);
    //   res.json(response);
    // } else {
    //   let response = new ResponseModel(1, "Copy profile success!");
    //   res.json(response);
    // }
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function startBrower(req, res) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--user-data-dir=C:\\Users\\ADMIN\\AppData\\Local\\Google\\Chrome\\User Data\\${req.params.id}`,
      ],
    });
    await browser.newPage();
    await Profile.findByIdAndUpdate(req.params.id, {
      status: true,
    });
    listBrowser.push({ id: req.params.id, browser: browser });
    res.json({ status: 1 });
    browser.on("disconnected", async () => {
      await Profile.findByIdAndUpdate(req.params.id, {
        status: false,
      });
      const user = await Users.findById(req.user._id);
      // console.log(user);
      user?.socketId.map((item) => {
        _io.to(item).emit("disconnectedBrower", req.params.id);
      });
    });
  } catch (error) {
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
      console.log("menu", menu);
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
