const { isValidObjectId } = require("mongoose");
const Tags = require("../../database/entities/Tags");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");

async function createTag(req, res) {
  if (req.actions.includes("createTag")) {
    try {
      let tag = new Tags(req.body);
      tag.createdTime = Date.now();
      await tag.save((err, newTag) => {
        if (err) {
          let response = new ResponseModel(-2, err.message, err);
          res.json(response);
        } else {
          let response = new ResponseModel(1, "Create tag success!", newTag);
          res.json(response);
        }
      });
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res.sendStatus(403);
  }
}

async function updateTag(req, res) {
  if (req.actions.includes("updateTag")) {
    try {
      let newTag = { updatedTime: Date.now(), user: req.userId, ...req.body };
      let updatedTag = await Tags.findOneAndUpdate(
        { _id: req.params.id },
        newTag
      );
      if (!updatedTag) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Update tag success!", newTag);
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

async function deleteTag(req, res) {
  if (req.actions.includes("deleteTag")) {
    if (isValidObjectId(req.params.id)) {
      try {
        let tag = await Tags.findByIdAndDelete(req.params.id);
        if (!tag) {
          let response = new ResponseModel(0, "No item found!", null);
          res.json(response);
        } else {
          let response = new ResponseModel(1, "Delete tag success!", null);
          res.json(response);
        }
      } catch (error) {
        let response = new ResponseModel(404, error.message, error);
        res.status(404).json(response);
      }
    } else {
      res.status(404).json(new ResponseModel(404, "TagId is not valid!", null));
    }
  } else {
    res.sendStatus(403);
  }
}

async function getPagingTags(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  let searchObj = {};
  if (req.query.search) {
    searchObj = { tagName: { $regex: ".*" + req.query.search + ".*" } };
  }
  try {
    let tags = await Tags.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .sort({
        createdTime: "desc",
      });
    let count = await Tags.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, tags);
    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getTagById(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let tag = await Tags.findById(req.params.id);
      res.json(tag);
    } catch (error) {
      res.status(404).json(404, error.message, error);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "TagId is not valid!", null));
  }
}
async function getTagBySlug(req, res) {
  try {
    let tag = await Tags.findOne({ tagSlug: req.params.slug });
    console.log(tag);
    res.json(tag);
  } catch (error) {
    res.status(404).json(404, error.message, error);
  }
}
exports.createTag = createTag;
exports.updateTag = updateTag;
exports.deleteTag = deleteTag;
exports.getPagingTags = getPagingTags;
exports.getTagById = getTagById;
exports.getTagBySlug = getTagBySlug;
