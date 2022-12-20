const Apps = require("../../database/entities/Apps");
const Menus = require("../../database/entities/Menus");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");
const { isValidObjectId, Types } = require("mongoose");

async function createApp(req, res) {
  // if (req.actions.includes("createApp")) {
  try {
    let menu = new Apps(req.body);
    menu.createdTime = Date.now();
    menu.user = req.userId;
    menu.save((err, newApp) => {
      if (err) {
        let response = new ResponseModel(-2, err.message, err);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Create app success!", newApp);
        res.json(response);
      }
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
  // } else {
  //   res.sendStatus(403);
  // }
}

async function updateApp(req, res) {
  if (req.actions.includes("updateApp")) {
    try {
      let newApp = { updatedTime: Date.now(), user: req.userId, ...req.body };
      let updateApp = await Apps.findOneAndUpdate(
        { _id: req.params.id },
        newApp
      );
      if (!updateApp) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Update app success!", newApp);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res.sendStatus(403);
  }
}

async function deleteApp(req, res) {
  // if (req.actions.includes("deleteApp")) {
  if (isValidObjectId(req.params.id)) {
    try {
      let app = await Apps.findByIdAndDelete(req.params.id);
      if (!app) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Delete app success!", null);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "AppId is not valid!", null));
  }
  // } else {
  //   res.sendStatus(403);
  // }
}

async function getPagingApps(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  let searchObj = {};
  if (req.query.search) {
    searchObj = {
      appName: { $regex: ".*" + req.query.search + ".*" },
    };
  }

  try {
    let apps = await Apps.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      // .populate("user")
      .sort({ createdTime: "desc" });
    console.log(apps);
    let count = await Apps.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, apps);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getAppById(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let app = await Apps.findById(req.params.id);
      res.json(app);
    } catch (error) {
      res.status(404).json(404, error.message, error);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "Appid is not valid!", null));
  }
}

async function getAllApps(req, res) {
  let allApps = await Apps.find({});
  res.json(allApps);
}

exports.createApp = createApp;
exports.updateApp = updateApp;
exports.deleteApp = deleteApp;
exports.getPagingApps = getPagingApps;
exports.getAppById = getAppById;
exports.getAllApps = getAllApps;
