const Operating = require("../../../database/entities/system/Operating");
const VersionOfOperating = require("../../../database/entities/system/VersionOfOperating");
//
const Supplier = require("../../../database/entities/system/Supplier");
const Card = require("../../../database/entities/system/Card");

//
const PagedModel = require("../../models/PagedModel");
const ResponseModel = require("../../models/ResponseModel");
const { isValidObjectId, Types } = require("mongoose");

//create
async function createCard(req, res) {
  console.log("req: ", req.body);
  // return;
  // console.log(`req.userId`, req.userId);
  try {
    req.body.user = req.userId || "630c754c5e1889934eee724a";
    req.body.supplier = req.body.supplier || "63b7fd112a17485fb895257a";
    let resData = new Card(req.body);

    console.log("resData: ", resData);

    resData.save((err, data) => {
      if (err) {
        let response = new ResponseModel(-2, err.message, err);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Create Card success!", data);
        res.json(response);
      }
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
//delete
async function deleteCard(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let data = await Card.findByIdAndDelete(req.params.id);
      if (!data) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Delete Card success!", null);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res
      .status(404)
      .json(new ResponseModel(404, "OperatingId is not valid!", null));
  }
}
//update
async function updateCard(req, res) {
  console.log(`req.params`, req.params);
  try {
    const data = {
      ...req.body,
      updatedTime: Date.now(),
      user: req.userId || "630c754c5e1889934eee724a",
      supplier: req.body.supplier || "63b684788e801bc786164bd3",
    };
    let updatedCard = await Card.findOneAndUpdate({ _id: req.params.id }, data);
    if (!updatedCard) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Update Card success!", data);
      res.json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getPagingCard(req, res) {
  // console.log("req: ", req.query);
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  let searchByLabel = req.query.searchByName || "";
  let searchBySupplier = req.query.searchBySupplier || "";
  const searchObj = {};
  if (searchByLabel) {
    searchObj["label"] = { $regex: ".*" + searchByLabel + ".*" };
  }
  if (searchBySupplier) {
    searchObj["supplier"] = searchBySupplier;
  }
  // search
  console.log(`aaa`, searchObj);
  // return;
  try {
    let data = await Card.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("user")
      .populate("supplier")
      .sort({ createdTime: "desc" });

    // data = data.map((item) => {
    //   // console.log(items)
    //   if (item.user != undefined && item.user != null && item.user != "") {
    //     item.user.password = "";
    //     return item;
    //   } else {
    //     return item;
    //   }
    // });

    // const count = data.length;
    // let totalPages = Math.ceil(count / pageSize);
    let totalPages = await Card.find({}).countDocuments();
    console.log("totalPages0000: ", totalPages);

    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, data);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function getCardById(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let data = await Card.findById(req.params.id)
        .populate("user")
        .populate("operating");
      let response = new ResponseModel(1, "successes!", data);
      res.json(response);
    } catch (error) {
      res.status(404).json(404, error.message, error);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "MenuId is not valid!", null));
  }
}
exports.createCard = createCard;
exports.deleteCard = deleteCard;
exports.updateCard = updateCard;
exports.getPagingCard = getPagingCard;
exports.getCardById = getCardById;
