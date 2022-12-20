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
const Group = require("../../database/entities/Group");
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
  console.log(req.body);
  try {
    req.body.userId = req.user._id;

    const { secret, userId } = req.body;
    const secretFilter = [];
    // secret?.map((item) => {
    //   if (!secretFilter?.includes(item)) {
    //     secretFilter.push(item);
    //   }
    // });
    const listData = secret?.map(async (item) => {
      const result = new Secrets({
        secret: item.secret,
        userId: [userId],
        groupId: item.group,
        userCreated: userId,
        createdTime: Date.now(),
        comment: item.comment,
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
    }).select("-_id secret userCreated");
    listData.map((item) => (item.userCreated = req.user._id));
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
      userCreated: req.user._id,
    });
    if (deleteMulti.deletedCount === 0) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(
        1,
        "Delete secret success!",
        deleteMulti
      );
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function updateUserSecret(req, res) {
  try {
    console.log(req.body);
    const { listSecret, userList } = req.body;
    const listUser = userList.map((item) => item._id);

    let newSecret = {
      updatedTime: Date.now(),
      $addToSet: { userId: listUser },
    };
    let updateSecret = await Secrets.updateMany(
      { _id: { $in: listSecret } },
      newSecret
    );
    if (!updateSecret) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Update secret success!", newSecret);
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
      let log = await Secrets.deleteOne({
        _id: req.params.id,
        userCreated: req.user._id,
      });
      if (log?.deletedCount === 0) {
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
async function getSecretById(req, res) {
  if (req.params.id) {
    try {
      let secret = await Secrets.findById(req.params.id);
      res.json(secret);
    } catch (error) {
      let response = new ResponseModel(-2, error.message, error);
      res.json(response);
    }
  } else {
    res.status(404).json(new ResponseModel(404, "logId is not valid!", null));
  }
}
async function getSecretByGroup(req, res) {
  try {
    let pageSize = req.query.pageSize || 10;
    let pageIndex = req.query.pageIndex || 1;
    const group = await Group.find({ userId: req.user._id });
    console.log(group)
    const listGroupId = group?.map((item) => item._id);
    let searchObj = { groupId: { $in: listGroupId } };
  if (req.query.search) {
    searchObj = {
      secret: { $regex: ".*" + req.query.search + ".*" },
      groupId: { $in: listGroupId },
    };
  }
    let secret = await Secrets.find({ groupId: { $in: listGroupId } }).populate("userId")
    .populate("userCreated")
    .populate("groupId");
    const result = secret?.map(async (item) => {
      let resultItem = {
        _id: item._id,
        secret: item?.secret,
        userId: item?.userId,
        userCreated: item?.userCreated,
        comment: item?.comment,
        createdTime: item?.createdTime,
        groupId: item?.groupId,
      };
      const token = authenticator.generate(item?.secret);
      resultItem.token = token;
      return resultItem;
    });
    Promise.all(result)
      .then(async (data) => {
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
      })
      .catch((err) => console.log(err));
  } catch (error) {
    let response = new ResponseModel(-2, error.message, error);
    res.json(response);
  }
}

async function getPaging(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  let user = await Users.findById(req?.user?._id);
  let searchObj = { userId: req?.user?._id };
  if (req.query.search) {
    searchObj = {
      secret: { $regex: ".*" + req.query.search + ".*" },
      userId: req?.user?._id,
    };
  }

  try {
    let log = await Secrets.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .populate("userId")
      .populate("userCreated")
      .populate("groupId")
      .sort({
        createdTime: "desc",
      });
    const result = log?.map(async (item) => {
      let resultItem = {
        _id: item._id,
        secret: item?.secret,
        userId: item?.userId,
        userCreated: item?.userCreated,
        comment: item?.comment,
        createdTime: item?.createdTime,
        group: item?.groupId,
      };
      const token = authenticator.generate(item?.secret);
      resultItem.token = token;
      return resultItem;
    });
    Promise.all(result)
      .then(async (data) => {
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
      })
      .catch((err) => console.log(err));
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
async function getQrCodeById(req, res) {
  const secret = await Secrets.findById(req.params.id).populate("userCreated");
  const otpToken = generateOTPToken(
    secret.userCreated?.email,
    secret.userCreated?.userName,
    secret?.secret
  );
  const qrcode = await generateQRCode(otpToken);
  res.json(qrcode);
}
async function updateCommentSecret(req, res) {
  // console.log(req.body);
  try {
    let newSecret = {
      updatedTime: Date.now(),
      comment: req.body?.comment,
      groupId: req.body?.groupId,
    };
    let updateSecret = await Secrets.findOneAndUpdate(
      { _id: req.params.id,userCreated:req.user?._id },
      newSecret
    );
    if (!updateSecret) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Update secret success!", newSecret);
      res.json(response);
    }
  } catch (error) {
    console.log(error);
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}
exports.deleteSecrets = deleteSecrets;
exports.exportSecret = exportSecret;
exports.importSecret = importSecret;
exports.insertSecret = insertSecret;
exports.updateUserSecret = updateUserSecret;
exports.deleteSecret = deleteSecret;
exports.getSecretById = getSecretById;
exports.getPaging = getPaging;
exports.updateCommentSecret = updateCommentSecret;
exports.getQrCodeById = getQrCodeById;
exports.getSecretByGroup = getSecretByGroup;
