const { isValidObjectId } = require("mongoose");
const Group = require("../../database/entities/Group");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");

async function createGroup(req, res) {
  //   if (req.actions.includes("createTag")) {
  try {
    console.log(req.user);
    req.body.userId = [req.user._id];
    req.body.userCreated = req.user._id;
    let group = new Group(req.body);
    group.createdTime = Date.now();
    group.save((err, newGroup) => {
      if (err) {
        let response = new ResponseModel(-2, err.message, err);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Create group success!", newGroup);
        res.json(response);
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

async function updateGroup(req, res) {
  if (req.actions.includes("updateGroup")) {
    try {
      let newGroup = { updatedTime: Date.now(), user: req.userId, ...req.body };
      let updatedGroup = await Group.findOneAndUpdate(
        { _id: req.params.id },
        newGroup
      );
      if (!updatedGroup) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Update Group success!", newGroup);
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

async function deleteGroup(req, res) {
  if (req.actions.includes("deleteGroup")) {
    if (isValidObjectId(req.params.id)) {
      try {
        let group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
          let response = new ResponseModel(0, "No item found!", null);
          res.json(response);
        } else {
          let response = new ResponseModel(1, "Delete group success!", null);
          res.json(response);
        }
      } catch (error) {
        let response = new ResponseModel(404, error.message, error);
        res.status(404).json(response);
      }
    } else {
      res
        .status(404)
        .json(new ResponseModel(404, "GroupId is not valid!", null));
    }
  } else {
    res.sendStatus(403);
  }
}

async function getPagingGroups(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  let searchObj = {};
  if (req.query.search) {
    searchObj = { nameGroup: { $regex: ".*" + req.query.search + ".*" } };
  }
  try {
    let groups = await Group.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .sort({
        createdTime: "desc",
      });
    let count = await Group.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, groups);
    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getGroupById(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let group = await Group.findById(req.params.id);
      res.json(group);
    } catch (error) {
      res.status(404).json(404, error.message, error);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "GroupId is not valid!", null));
  }
}

exports.createGroup = createGroup;
exports.updateGroup = updateGroup;
exports.deleteGroup = deleteGroup;
exports.getPagingGroups = getPagingGroups;
exports.getGroupById = getGroupById;
