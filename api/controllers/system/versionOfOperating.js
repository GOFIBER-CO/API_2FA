const Operating = require("../../../database/entities/system/Operating");
const VersionOfOperating = require("../../../database/entities/system/VersionOfOperating");

const PagedModel = require("../../models/PagedModel");
const ResponseModel = require("../../models/ResponseModel");
const { isValidObjectId, Types } = require("mongoose");

//create
async function createVersionOfOperating(req, res) {
  console.log("req: ", req.body);
  // return;
  // console.log(`req.userId`, req.userId);
  try {
    req.body.user = req.userId || "630c754c5e1889934eee724a";
    req.body.operating = req.body.operating || "63b684758e801bc786164bd1";
    let resData = new VersionOfOperating(req.body);

    console.log("resData: ", resData);

    resData.save((err, data) => {
      if (err) {
        let response = new ResponseModel(-2, err.message, err);
        res.json(response);
      } else {
        let response = new ResponseModel(
          1,
          "Create VersionOfOperating success!",
          data
        );
        res.json(response);
      }
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
//delete
async function deleteVersionOfOperating(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let data = await VersionOfOperating.findByIdAndDelete(req.params.id);
      if (!data) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(
          1,
          "Delete VersionOfOperating success!",
          null
        );
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
async function updateVersionOfOperating(req, res) {
  console.log(`req.params`, req.params);
  try {
    const data = {
      ...req.body,
      updatedTime: Date.now(),
      user: req.userId || "630c754c5e1889934eee724a",
      operating: req.body.operating || "63b684788e801bc786164bd3",
    };
    let updatedVersionOfOperating = await VersionOfOperating.findOneAndUpdate(
      { _id: req.params.id },
      data
    );
    if (!updatedVersionOfOperating) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(
        1,
        "Update VersionOfOperating success!",
        data
      );
      res.json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getPagingVersionOfOperating(req, res) {
  // console.log("req: ", req.query);
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  let searchByLabel = req.query.searchByName || "";
  let searchByOperating = req.query.searchByOperating || "";
  const searchObj = {};
  if (searchByLabel) {
    searchObj["label"] = { $regex: ".*" + searchByLabel + ".*" };
  }
  if (searchByOperating) {
    searchObj["operating"] = searchByOperating;
  }
  // search
  console.log(`aaa`, searchObj);
  // return;
  try {
    let data = await VersionOfOperating.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("user")
      .populate("operating")
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
    let totalPages = await VersionOfOperating.find({}).countDocuments();
    console.log("totalPages0000: ", totalPages);

    let pagedModel = new PagedModel(pageIndex, pageSize, totalPages, data);

    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function getVersionOfOperatingById(req, res) {
  if (isValidObjectId(req.params.id)) {
    try {
      let data = await VersionOfOperating.findById(req.params.id)
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
exports.createVersionOfOperating = createVersionOfOperating;
exports.deleteVersionOfOperating = deleteVersionOfOperating;
exports.updateVersionOfOperating = updateVersionOfOperating;
exports.getPagingVersionOfOperating = getPagingVersionOfOperating;
exports.getVersionOfOperatingById = getVersionOfOperatingById;
