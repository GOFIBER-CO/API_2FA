<<<<<<< HEAD
const Menus = require("../../database/entities/Profile");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");
const { isValidObjectId, Types } = require("mongoose");

async function createProfile(req, res) {
  console.log(req.body, `createProfile`);
  //   if (req.actions.includes("createProfile")) {
  try {
    let menu = new Menus(req.body);
    menu.createdTime = Date.now();
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
=======
// const { isValidObjectId } = require("mongoose");
const Profile = require("../../database/entities/GroupProfile");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");


async function createProfile(req, res) {
    //   if (req.actions.includes("createTag")) {
    try {
    //   console.log(req.user);
    //   req.body.userId = [req.user._id];
      req.body.userCreated = req.user._id;
      let profile = new Profile(req.body);
      profile.createdTime = Date.now();
      profile.save((err, newProfile) => {
        if (err) {
          let response = new ResponseModel(-2, err.message, err);
          return res.json(response);
        } else {
          let response = new ResponseModel(1, "Create profile success!", newProfile);
          return res.json(response);
        }
      });
    } catch (error) {
      console.log(error);
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
    //   } else {
    //     res.sendStatus(403);
    //   }
  }

  async function getPagingProfile(req, res) {
    let pageSize = req.query.pageSize || 10;
    let pageIndex = req.query.pageIndex || 1;
  
    let searchObj = {};
    if (req.query.search) {
      searchObj = { nameProfile: { $regex: ".*" + req.query.search + ".*" } };
    }
    try {
      let profiles = await Profile.find(searchObj)
        .skip(pageSize * pageIndex - pageSize)
        .limit(parseInt(pageSize))
        .sort({
          createdTime: "desc",
        });
    // console.log(profiles)
      let count = await Profile.find(searchObj).countDocuments();
      let totalPages = Math.ceil(count / pageSize);
      let pagedModel = new PagedModel(
        pageIndex,
        pageSize,
        totalPages,
        profiles,
        count
      );
      res.json(pagedModel);
>>>>>>> e8da8587fc1e61b562bbfbe21dc297bfec1a58b9
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
<<<<<<< HEAD
  } else {
    res.status(404).json(new ResponseModel(404, "MenuId is not valid!", null));
  }
  //   } else {
  //     res.sendStatus(403);
  //   }
}

async function getPagingProfile(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  console.log(req.query.search);
  let searchObj = {};
  if (req.query.search) {
    searchObj = {
      menuName: { $regex: ".*" + req.query.search + ".*" },
    };
  }

  try {
    let menus = await Menus.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      //   .populate("user")
      .sort({ createdTime: "desc" });
    let arrayMenus = [];
    // for (let i = 0; i < menus.length; i++) {
    //   if (menus[i].parent != null) {
    //     let parentName = menus.find(
    //       (item) => item.id.toString() == menus[i].parent.toString()
    //     );
    //     menus[i].parent = parentName;
    //   }
    // }
    // menus = menus.map((menu) => {
    //   // console.log(menus)
    //   if (menu.user != undefined && menu.user != null && menu.user != "") {
    //     menu.user.password = "";
    //     return menu;
    //   } else {
    //     return menu;
    //   }
    // });

    // let count = await Menus.find(searchObj).countDocuments();
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
exports.createProfile = createProfile;
exports.updateProfile = updateProfile;
exports.deleteProfile = deleteProfile;
exports.getPagingProfile = getPagingProfile;
exports.getProfileById = getProfileById;
=======
  }


  exports.createProfile = createProfile;
  exports.getPagingProfile = getPagingProfile;
>>>>>>> e8da8587fc1e61b562bbfbe21dc297bfec1a58b9
