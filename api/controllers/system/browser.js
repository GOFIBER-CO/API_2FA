const Browser = require("../../../database/entities/system/Browser");
const PagedModel = require("../../models/PagedModel");
const ResponseModel = require("../../models/ResponseModel");
const { isValidObjectId, Types } = require("mongoose");

//create
async function createBrowser(req, res) {
  console.log("res: ", req.body);
  // console.log(`req.userId`, req.userId);
  try {
    req.body.user = req.userId || "63998958b37cef51ccae971d";
    let resData = new Browser(req.body);
    console.log("resData: ", resData);
    resData.save((err, data) => {
      if (err) {
        let response = new ResponseModel(-2, err.message, err);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Create Browser success!", data);
        res.json(response);
      }
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
//delete
async function deleteBrowser(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let data = await Browser.findByIdAndDelete(req.params.id);
      if (!data) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Delete Browser success!", null);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res
      .status(404)
      .json(new ResponseModel(404, "BrowserId is not valid!", null));
  }
}
async function updateBrowser(req, res) {
  console.log(`req.params`, req.params);

  try {
    const data = { updatedTime: Date.now(), user: req.userId, ...req.body };
    let updatedBrowser = await Browser.findOneAndUpdate(
      { _id: req.params.id },
      data
    );
    if (!updatedBrowser) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Update Browser success!", data);
      res.status(200).json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getPagingBrowser(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  //   console.log(req.query.search);
  let searchObj = {};
  if (req.query.search) {
    searchObj = {
      label: { $regex: ".*" + req.query.search + ".*" },
    };
  }

  try {
    let data = await Browser.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("user")
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
    let totalPages = await Browser.find({}).countDocuments();
    console.log("totalPages: ", totalPages);

    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, data);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

exports.createBrowser = createBrowser;
exports.deleteBrowser = deleteBrowser;
exports.updateBrowser = updateBrowser;
exports.getPagingBrowser = getPagingBrowser;
