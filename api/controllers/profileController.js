const Profile = require("../../database/entities/Profile");
const Menus = require("../../database/entities/Profile");
const Users = require("../../database/entities/authentication/Users");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");
const { isValidObjectId, Types } = require("mongoose");
const puppeteer = require("puppeteer");
const listBrowser = [];
async function createProfile(req, res) {
  console.log(req.body, `createProfile`);
  //   if (req.actions.includes("createProfile")) {
  try {
    let menu = new Menus(req.body);
    menu.createdTime = Date.now();
    menu.updatedTime = Date.now();
    menu.lastTimeOpen = Date.now();

    //cộng 31 ngày từ khi tạo
    const date = new Date();
    date.setDate(date.getDate() + 31);
    menu.durationTime = date;
    //   menu.user = req.userId;
    //   if (menu.parent) {
    //     let menuCheckUnique = await Menus.findOne({
    //     //   menuSlug: menu.menuSlug,
    //     //   "parent._id": menu.parent._id,
    //     });
    //     console.log(menuCheckUnique);
    //     if (menuCheckUnique) {
    //       let response = new ResponseModel(404, error.message, error);
    //       res.status(404).json(response);
    //     }
    //   }
    await menu.save((err, newMenu) => {
      if (err) {
        let response = new ResponseModel(-2, err.message, err);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Create menu success!", newMenu);
        res.json(response);
      }
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
  //   } else {
  //     res.sendStatus(403);
  //   }
}

async function updateProfile(req, res) {
  console.log(`req.params`, req.params);
  // if (req.actions.includes("updateProfile")) {
  try {
    // let newMenu = { updatedTime: Date.now(), user: req.userId, ...req.body };
    let newMenu = { updatedTime: Date.now(), ...req.body };
    //   if (newMenu.parent) {
    //     let menuCheckUnique = await Menus.findOne({
    //       menuSlug: newMenu.menuSlug,
    //       parent: newMenu.parent,
    //     });
    //     console.log(menuCheckUnique);
    //     if (menuCheckUnique) {
    //       let response = new ResponseModel(
    //         404,
    //         "Không được trùng cả name và parent",
    //         error
    //       );
    //       res.status(404).json(response);
    //     }
    //   }
    let updatedMenu = await Menus.findOneAndUpdate(
      { _id: req.params.id },
      newMenu
    );
    if (!updatedMenu) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Update menu success!", newMenu);
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
  //   if (req.actions.includes("deleteProfile")) {
  if (isValidObjectId(req.params.id)) {
    try {
      let menu = await Menus.findByIdAndDelete(req.params.id);
      if (!menu) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Delete menu success!", null);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "MenuId is not valid!", null));
  }
  //   } else {
  //     res.sendStatus(403);
  //   }
}

async function getPagingProfile(req, res) {
  console.log(req.query);
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  console.log(req.query.search);
  let searchObj = {};
  if (req.query.search) {
    searchObj = {
      name: { $regex: ".*" + req.query.search + ".*" },
    };
  }

  try {
    let menus = await Menus.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      //   .populate("user")
      .sort({ createdTime: "desc" });
    let arrayMenus = [];

    const count = menus.length;
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, menus);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getPagingProfileNoGroup(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  let searchObj = {
    "overView.group": "",
  };

  try {
    let menus = await Menus.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      //   .populate("user")
      .sort({ createdTime: "desc" });
    const count = menus.length;
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, menus);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getProfileById(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let menu = await Menus.findById(req.params.id);
      res.json(menu);
    } catch (error) {
      res.status(404).json(404, error.message, error);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "MenuId is not valid!", null));
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
    const page = await browser.newPage();
    const updateProfile = await Profile.findByIdAndUpdate(req.params.id, {
      status: true,
    });
    listBrowser.push({ id: req.params.id, browser: browser });
    res.json({ status: 1 });
    browser.on("disconnected", async () => {
      await Profile.findByIdAndUpdate(req.params.id, {
        status: false,
      });
      const user = await Users.findById(req.user._id);
      console.log(user);
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
    console.log(error);
    res.status(404).json(404, error.message, error);
  }
}
exports.createProfile = createProfile;
exports.updateProfile = updateProfile;
exports.deleteProfile = deleteProfile;
exports.getPagingProfile = getPagingProfile;
exports.getProfileById = getProfileById;
exports.startBrower = startBrower;
exports.endBrower = endBrower;
exports.getPagingProfileNoGroup = getPagingProfileNoGroup;
