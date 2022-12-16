const { isValidObjectId } = require("mongoose");
const Schema = require("../../database/entities/Schema");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");

async function createSchema(req, res) {
  if (req.actions.includes("createSchema")) {
    try {
      let role = new Schema(req.body);
      role.createdTime = Date.now();
      await role.save((err, newRole) => {
        if (err) {
          let response = new ResponseModel(-2, err.message, err);
          res.json(response);
        } else {
          let response = new ResponseModel(
            1,
            "Create schema success!",
            newRole
          );
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

async function updateSchema(req, res) {
  if (req.actions.includes("updateSchema")) {
    try {
      let newRole = { updatedTime: Date.now(), user: req.userId, ...req.body };
      let updatedRole = await Schema.findOneAndUpdate(
        { _id: req.params.id },
        newRole
      );
      if (!updatedRole) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Update schema success!", newRole);
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

async function deleteSchema(req, res) {
  if (req.actions.includes("deleteSchema")) {
    if (isValidObjectId(req.params.id)) {
      try {
        const role = await Schema.findByIdAndDelete(req.params.id);
        if (!role) {
          let response = new ResponseModel(0, "No item found!", null);
          res.json(response);
        } else {
          let response = new ResponseModel(1, "Delete schema success!", null);
          res.json(response);
        }
      } catch (error) {
        let response = new ResponseModel(404, error.message, error);
        res.status(404).json(response);
      }
    } else {
      res
        .status(404)
        .json(new ResponseModel(404, "SchemaId is not valid!", null));
    }
  } else {
    res.sendStatus(403);
  }
}

async function getAllSchema(req, res) {
  try {
    let roles = await Schema.find({}).populate("post");
    res.json(roles);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getPagingSchema(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  let searchObj = {};
  if (req.query.search) {
    searchObj = { name: { $regex: ".*" + req.query.search + ".*" } };
  }
  try {
    let roles = await Schema.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .populate("post")
      .limit(parseInt(pageSize))
      .sort({
        createdTime: "desc",
      });
    let count = await Schema.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, roles);
    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getSchemaByPost(req, res) {
  try {
    let role = await Schema.find({ post: req.params.slug }).populate("post");
    res.json(role);
  } catch (error) {
    res.status(404).json(404, error.message, error);
  }
}
async function getSchemaByPage(req, res) {
  try {
    let role = await Schema.find({ page: req.params.slug });
    res.json(role);
  } catch (error) {
    res.status(404).json(404, error.message, error);
  }
}

exports.createSchema = createSchema;
exports.deleteSchema = deleteSchema;
exports.getAllSchema = getAllSchema;
exports.getPagingSchema = getPagingSchema;
exports.getSchemaByPage = getSchemaByPage;
exports.getSchemaByPost = getSchemaByPost;
exports.updateSchema = updateSchema;
