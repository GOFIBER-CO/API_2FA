const Categories = require("../../database/entities/Categories");
const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");
const { isValidObjectId } = require("mongoose");

async function createCategory(req, res) {
  if (req.actions.includes("createCategory")) {
    try {
      let category = new Categories(req.body);
      category.createdTime = Date.now();
      category.user = req.userId;
      let newCategory = await category.save();
      let response = new ResponseModel(
        1,
        "Create category success!",
        newCategory
      );
      res.json(response);
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.json(response);
    }
  } else {
    res.sendStatus(403);
  }
}

async function updateCategory(req, res) {
  if (req.actions.includes("updateCategory")) {
    try {
      let newCategory = {
        updatedTime: Date.now(),
        user: req.userId,
        ...req.body,
      };
      let updatedCategory = await Categories.findOneAndUpdate(
        { _id: req.params.id },
        newCategory
      );
      if (!updatedCategory) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(
          1,
          "Update category success!",
          newCategory
        );
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

async function deleteCategory(req, res) {
  if (req.actions.includes("deleteCategory")) {
    if (isValidObjectId(req.params.id)) {
      try {
        let category = await Categories.findByIdAndDelete(req.params.id);
        if (!category) {
          let response = new ResponseModel(0, "No item found!", null);
          res.json(response);
        } else {
          let response = new ResponseModel(1, "Delete category success!", null);
          res.json(response);
        }
      } catch (error) {
        let response = new ResponseModel(-99, error.message, error);
        res.json(response);
      }
    } else {
      res
        .status(404)
        .json(new ResponseModel(404, "CategoryId is not valid!", null));
    }
  } else {
    res.sendStatus(403);
  }
}

async function getPagingCategories(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  let searchObj = {};
  if (req.query.search) {
    searchObj = { categoryName: { $regex: ".*" + req.query.search + ".*" } };
  }
  try {
    let categories = await Categories.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("user")
      .sort({
        createdTime: "desc",
      });

    categories = categories.map((category) => {
      if (
        category.user != undefined &&
        category.user != null &&
        category.user != ""
      ) {
        category.user.password = "";
        return category;
      } else {
        return category;
      }
    });

    let count = await Categories.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(
      pageIndex,
      pageSize,
      totalPages,
      categories
    );
    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getCategoryById(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let category = await Categories.findById(req.params.id);
      res.json(category);
    } catch (error) {
      res.status(404).json(404, error.message, error);
    }
  } else {
    res
      .status(404)
      .json(new ResponseModel(404, "CategoryId is not valid!", null));
  }
}

exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getPagingCategories = getPagingCategories;
exports.getCategoryById = getCategoryById;
