const PagedModel = require("../models/PagedModel");
const ResponseModel = require("../models/ResponseModel");
const Secrets = require("../../database/entities/Secret");
const generateRandomString = require("../../helpers/generateRandomString");
const otplib = require("otplib");
const { authenticator } = otplib;
const qrcode = require("qrcode");
const Users = require("../../database/entities/authentication/Users");
const Export = require("../../database/entities/Export");
const Secret = require("../../database/entities/Secret");
const generateOTPToken = (username, serviceName, secret) => {
  return authenticator.keyuri(username, serviceName, secret);
};

const generateQRCode = async (otpAuth) => {
  try {
    const QRCodeImageUrl = await qrcode.toDataURL(otpAuth);
    return QRCodeImageUrl;
  } catch (error) {
    console.log("Could not generate QR code", error);
    return;
  }
};
async function insertSecret(req, res, next) {
  try {
    req.body.userId = req.user._id;

    const { secret, userId, comment } = req.body;
    const secretFilter = [];
    secret?.map((item) => {
      if (!secretFilter?.includes(item)) {
        secretFilter.push(item);
      }
    });
    const listData = secretFilter?.map(async (item) => {
      const result = new Secrets({
        secret: item,
        userId: userId,
        createdTime: Date.now(),
        comment,
      });
      await result.save();
    });
    await Promise.all(listData)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    let response = new ResponseModel(1, "Create secret success!", {});
    res.json(response);
    // console.log(listData);
    // const result = await Secrets.insertMany(listData);
  } catch (error) {
    console.log(error);
    next();
    // let response = new ResponseModel(404, error.message, error);
    // res.status(404).json(response);
  }
}

async function exportSecret(req, res) {
  try {
    req.body.userId = req.user._id;
    let secret = new Export(req.body);
    secret.createdTime = Date.now();
    secret.save(async function (err, newSecret) {
      if (err) {
        let response = new ResponseModel(-1, err.message, err);
        res.json(response);
      } else {
        const qrcode = await generateQRCode(
          `${process.env.URL_LOCAL}/api/secret/import/${newSecret._id}`
        );
        let response = new ResponseModel(1, "Create secret success!", qrcode);
        res.json(response);
      }
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function importSecret(req, res) {
  try {
    const listSecret = await Export.findById(req.params.id);
    const listData = await Secrets.find({
      _id: { $in: listSecret.secret },
    }).select("-_id secret userId");
    listData.map((item) => (item.userId = req.user._id));
    Secrets.createIndexes({ secret: 1, userId: 1 }, { unique: true });
    const result = await Secrets.insertMany(listData);
    let response = new ResponseModel(1, "Import secret success!", result);
    res.json(response);
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function deleteSecrets(req, res) {
  try {
    const deleteMulti = await Secrets.deleteMany({
      _id: req.body,
    });
    let response = new ResponseModel(1, "Delete secret success!", deleteMulti);
    res.json(response);
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function updateLog(req, res) {
  try {
    let newLog = { updatedTime: Date.now(), ...req.body };
    let updatedLog = await Logs.findOneAndUpdate(
      { _id: req.params.id },
      newLog
    );
    if (!updatedLog) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Update log success!", newLog);
      res.json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function deleteSecret(req, res) {
  // if (isValidObjectId(req.params.id)) {
  if (req.params.id) {
    try {
      let log = await Secrets.findByIdAndDelete(req.params.id);
      if (!log) {
        let response = new ResponseModel(0, "No item found!", null);
        res.json(response);
      } else {
        let response = new ResponseModel(1, "Delete log success!", null);
        res.json(response);
      }
    } catch (error) {
      let response = new ResponseModel(404, error.message, error);
      res.status(404).json(response);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "logId is not valid!", null));
  }
}

async function getLogById(req, res) {
  if (req.body.logId) {
    try {
      let log = await Logs.findById(req.body.logId);
      res.json(log);
    } catch (error) {
      let response = new ResponseModel(-2, error.message, error);
      res.json(response);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "logId is not valid!", null));
  }
}

async function getPaging(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  let user = await Users.findById(req?.user?._id);
  let searchObj = { userId: req?.user?._id };
  // if (req.query.search) {
  //   searchObj = {
  //     // logName: { $regex: ".*" + req.query.search + ".*" },
  //     userId: req?.user?._id,
  //   };
  // } else {
  //   searchObj = {
  //     userId: req?.user?._id,
  //   };
  // }

  try {
    let log = await Secrets.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("userId")
      .sort({
        createdTime: "desc",
      });
    const result = log.map(async (item) => {
      let resultItem = {
        _id: item._id,
        secret: item?.secret,
        userId: item?.userId,
        comment: item?.comment,
        createdTime: item?.createdTime,
      };
      const token = authenticator.generate(item.secret);
      resultItem.token = token;
      const otpToken = generateOTPToken(
        user.email,
        user.userName,
        item?.secret
      );
      const qrcode = await generateQRCode(otpToken);
      resultItem.qrcode = qrcode;
      return resultItem;
    });
    Promise.all(result).then(async (data) => {
      let count = await Secrets.find(searchObj).countDocuments();
      let totalPages = Math.ceil(count / pageSize);
      let pagedModel = new PagedModel(
        pageIndex,
        pageSize,
        totalPages,
        data,
        count
      );
      res.json(pagedModel);
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getLogByUserId(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  let searchObj = {};
  if (req.query.search) {
    searchObj = { logName: { $regex: ".*" + req.query.search + ".*" } };
  }
  if (req.query.userId) {
    searchObj.user = req.query.userId;
  }
  if (req.query.cloudServerId) {
    searchObj.cloudServer = req.query.cloudServerId;
  }

  try {
    let log = await Logs.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .sort({
        createdTime: "desc",
      })
      .populate("user")
      .populate("cloudServer");

    let count = await Logs.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(
      pageIndex,
      pageSize,
      totalPages,
      log,
      count
    );
    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

exports.deleteSecrets = deleteSecrets;
exports.exportSecret = exportSecret;
exports.importSecret = importSecret;
exports.insertSecret = insertSecret;
exports.updateLog = updateLog;
exports.deleteSecret = deleteSecret;
exports.getLogById = getLogById;
exports.getPaging = getPaging;
exports.getLogByUserId = getLogByUserId;
