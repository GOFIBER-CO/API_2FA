const Ram = require("../../../database/entities/system/Ram");
const ProxyModel = require("../../../database/entities/system/Proxy");

const PagedModel = require("../../models/PagedModel");
const ResponseModel = require("../../models/ResponseModel");
const { isValidObjectId, Types } = require("mongoose");

//create
async function createProxy(req, res) {
  console.log("res: ", req.body);
  // console.log(`req.userId`, req.userId);
  try {
    req.body.user = req.userId || "63998958b37cef51ccae971d";
    req.body.modeOfProxy = req.body.modeOfProxy || "63b8e997f6f81bd99a3189cf";
    let resData = new ProxyModel(req.body);
    console.log("resData: ", resData);
    resData.save((err, data) => {
      if (err) {
        let response = new ResponseModel(-2, err.message, err);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Create Proxy success!", data);
        res.json(response);
      }
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
//delete
async function deleteProxy(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let data = await ProxyModel.findByIdAndDelete(req.params.id);
      if (!data) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Delete Proxy success!", null);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "RamId is not valid!", null));
  }
}
async function updateProxy(req, res) {
  console.log(`req.params`, req.params);

  try {
    const data = { updatedTime: Date.now(), ...req.body, user: req.userId };
    let updatedProxy = await ProxyModel.findOneAndUpdate(
      { _id: req.params.id },
      data
    );
    if (!updatedProxy) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Update Proxy success!", data);
      res.status(200).json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getPagingProxy(req, res) {
  console.log("req: ", req.query);
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  //   console.log(req.query.search);
  let searchObj = {};
  if (req.query.searchByName) {
    searchObj = {
      ip: { $regex: ".*" + req.query.searchByName + ".*" },
    };
  }
  if (req.query.searchByProxy) {
    searchObj["modeOfProxy"] = req.query.searchByProxy;
  }

  try {
    let data = await ProxyModel.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("user")
      .populate("modeOfProxy")
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
    let totalPages = await ProxyModel.find({}).countDocuments();
    // console.log("totalPages: ", totalPages);

    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, data);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

exports.createProxy = createProxy;
exports.deleteProxy = deleteProxy;
exports.updateProxy = updateProxy;
exports.getPagingProxy = getPagingProxy;
