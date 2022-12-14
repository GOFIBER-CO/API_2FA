const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const PagedModel = require("../../models/PagedModel");
const ResponseModel = require("../../models/ResponseModel");
const Users = require("../../../database/entities/authentication/Users");
const qrcode = require("qrcode");
const otplib = require("otplib");
const generateRandomString = require("../../../helpers/generateRandomString");
const RefreshToken = require("../../../database/entities/RefreshToken");
const { authenticator } = otplib;
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const generateUniqueSecret = () => {
  return authenticator.generateSecret();
};

const generateOTPToken = (username, serviceName, secret) => {
  return authenticator.keyuri(username, serviceName, secret);
};

const verifyOTPToken = (token, secret) => {
  return authenticator.verify({ token, secret });
  // return authenticator.check(token, secret)
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

async function getSurplus(req, res) {
  if (req.params.id) {
    const user = await Users.findById(req.params.id).select("surplus");
    return res.status(200).json({ surplus: user.surplus });
  } else {
    return res.status(403).json({ message: "Không tồn tại người dùng" });
  }
}

async function getQrCode(req, res) {
  if (req.params.id) {
    const id = req.params.id;
    try {
      const user = await Users.findById(id);
      if (!user) return res.status(404).json({ message: "Không có user" });
      const secret = generateUniqueSecret();
      await Users.findByIdAndUpdate(id, { secret: secret });
      const otpToken = generateOTPToken(user.userName, "login", secret);
      const qrcode = await generateQRCode(otpToken);
      return res.status(200).json({ qrcode: qrcode, secret: secret });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  } else {
    return res.status(403).json({ message: "Không có user" });
  }
}

async function verify2FaToken(req, res) {
  try {
    if (!req.body.id || !req.body.token) {
      return res.status(403).json({ message: "Thiếu token hoặc user id" });
    }
    const id = req.body.id;
    const token = req.body.token;

    let user = await Users.findById(id).populate("role");

    const check = verifyOTPToken(token, user.secret);

    if (check) {
      await Users.findByIdAndUpdate(id, { isEnable2FaAuthenticate: true });
      user.password = "";
      user.secret = "";
      return res
        .status(200)
        .json({ status: 1, message: "Verify token thành công", user: user });
    }
    return res.status(403).json({ message: "Verify token thất bại" });
  } catch (error) {
    console.log(error);
  }
}

async function login2Fa(req, res) {
  try {
    if (!req.body.id || !req.body.token) {
      return res.status(403).json({ message: "Thiếu token hoặc user id" });
    }
    const id = req.body.id;
    const token = req.body.token;

    let user = await Users.findById(id).populate("role");

    const check = verifyOTPToken(token, user.secret);

    if (check) {
      user.password = "";
      user.secret = "";
      jwt.sign(
        { user },
        secretKey,
        { expiresIn: "24h" },
        async (err, token) => {
          if (err) {
            let response = new ResponseModel(-2, err.message, err);
            res.json(response);
          } else {
            let expiredAt = new Date(
              new Date().setHours(new Date().getHours() + 4)
            );
            let response = new ResponseModel(1, "Login success!", {
              user: user,
              token: token,
              expiredAt: expiredAt,
            });
            res.json(response);
          }
        }
      );
    } else {
      return res.status(403).json({ message: "Verify token thất bại" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
}

async function login(req, res) {
  try {
    let user = await Users.findOne({ userName: req.body.userName });
    if (user) {
      if (
        user.password ==
        crypto
          .createHash("sha256", secretKey)
          .update(req.body.password)
          .digest("hex")
      ) {
        const token = jwt.sign(
          {
            _id: user._id,
            nghi: +new Date(),
          },
          process.env.SECRET_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_TIME,
          }
        );
        const refreshToken = jwt.sign(
          {
            id: user._id,
            iat: new Date().getTime(),
          },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: process.env.REFRESH_TOKEN_TIME,
          }
        );
        res.cookie("refreshToken", refreshToken, {
          secure: false,
          httpOnly: true,
          expires: new Date(new Date().setDate(new Date().getDate() + 30)),
        });
        await RefreshToken.deleteMany({
          user: user._id,
        });
        await RefreshToken.create({
          refreshToken: refreshToken,
          user: user._id,
        });
        user.password = "";
        let expiredAt = new Date(
          new Date().setHours(new Date().getHours() + 4)
        );

        let response = new ResponseModel(1, "Login success!", {
          user: user,
          token: token,
          expiredAt: expiredAt,
          refreshToken,
        });
        res.json(response);
      } else {
        let response = new ResponseModel(2, "Wrong password!", null);
        res.json(response);
      }
    } else {
      let response = new ResponseModel(4, "Account was not found", null);
      res.json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function insertUser(req, res) {
  if (req.actions.includes("insertUser")) {
    try {
      let user = new Users(req.body);
      user.createdTime = Date.now();
      user.password = crypto
        .createHash("sha256", secretKey)
        .update(user.password)
        .digest("hex");

      let role = await Roles.findOne({ roleName: req.body.roleName });
      if (!role) {
        let response = new ResponseModel(0, "No Customer found!", null);
        return res.json(response);
      }
      user.role = role._id;

      user.save(function (err, newUser) {
        if (err) {
          let response = new ResponseModel(-1, err.message, err);
          res.json(response);
        } else {
          newUser.password = "";
          let response = new ResponseModel(1, "Create user success!", newUser);
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

async function register(req, res) {
  try {
    const emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!req.body.userName) {
      let response = new ResponseModel(0, "User Name is not null!", null);
      return res.json(response);
    }
    if (!req.body.password) {
      let response = new ResponseModel(0, "Password is not null!", null);
      return res.json(response);
    }
    // if (!req.body.phoneNumber) {
    //   let response = new ResponseModel(0, "Phone Number is not null!", null);
    //   return res.json(response);
    // }
    if (!req.body.email) {
      let response = new ResponseModel(0, "Email is not null!", null);
      return res.json(response);
    }
    if (!emailRegexp.test(req.body.email)) {
      let response = new ResponseModel(0, "Email invalidate!", null);
      return res.json(response);
    }

    req.body.code = generateRandomString();
    let user = new Users(req.body);
    user.createdTime = Date.now();
    user.password = crypto
      .createHash("sha256", secretKey)
      .update(user.password)
      .digest("hex");
    user.save(function (err, newUser) {
      if (err) {
        let response = new ResponseModel(-1, err.message, err);
        res.json(response);
      } else {
        newUser.password = "";
        let response = new ResponseModel(1, "Create user success!", newUser);
        res.json(response);
      }
    });
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getPaging(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;

  let searchObj = {};
  if (req.query.search) {
    searchObj = { userName: { $regex: ".*" + req.query.search + ".*" } };
  }
  try {
    let users = await Users.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .sort({
        createdTime: "desc",
      });
    let count = await Users.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(
      pageIndex,
      pageSize,
      totalPages,
      users,
      count
    );
    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getUserById(req, res) {
  if (req.body.userId) {
    try {
      let user = await Users.findById(req.body.userId);
      let { password, secret, ...returnResult } = user._doc;
      res.json(returnResult);
    } catch (error) {
      let response = new ResponseModel(-2, error.message, error);
      res.json(response);
    }
  } else {
    res.sendStatus(403);
  }
}

async function deleteUser(req, res) {
  if (req.actions.includes("deleteUser")) {
    if (isValidObjectId(req.params.id)) {
      try {
        let user = await Users.findByIdAndDelete(req.params.id);
        if (!user) {
          let response = new ResponseModel(0, "No item found!", null);
          res.json(response);
        } else {
          let response = new ResponseModel(1, "Delete user success!", null);
          res.json(response);
        }
      } catch (error) {
        let response = new ResponseModel(404, error.message, error);
        res.status(404).json(response);
      }
    } else {
      res
        .status(404)
        .json(new ResponseModel(404, "UserId is not valid!", null));
    }
  } else {
    res.sendStatus(403);
  }
}

async function updateUser(req, res) {
  try {
    let newUser = { updatedTime: Date.now(), ...req.body };
    let updatedUser = await Users.findOneAndUpdate(
      { _id: req.params.id },
      newUser
    );
    if (!updatedUser) {
      let response = new ResponseModel(0, "No item found!", null);
      res.json(response);
    } else {
      let response = new ResponseModel(1, "Update user success!", newUser);
      res.json(response);
    }
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function forgotPassword(req, res) {
  if (req.body.email) {
    user = await Users.findOne({ email: req.body.email });
    if (user) {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "lekhalinh160198@gmail.com",
          pass: "wpkzdnmcllhexunx",
        },
      });
      const textSendMail = `<h1>Xin chào ${user.userName}</h1><br>
                           <span>Link đổi mật khẩu: <p>https://v2.vietserver.vn/auth/reset-password/${user._id}</p></span>`;

      const mailOptions = {
        from: "KgozTdmTaKtIrePV@gmail.com",
        to: user.email,
        subject: "Quên mật khẩu tại KgozTdmTaKtIrePV Việt Nam",
        html: textSendMail,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          let response = new ResponseModel(404, error.response, error);
          res.status(404).json(response);
        } else {
          let response = new ResponseModel(
            1,
            "Send mail success!",
            req.body.email
          );
          res.json(response);
        }
      });
    } else {
      let response = new ResponseModel(0, "User was not found", null);
      res.json(response);
    }
  } else {
    let response = new ResponseModel(0, "Email was not found", null);
    res.json(response);
  }
}

async function changePassword(req, res) {
  if (req.body.userId && req.body.newPassword) {
    try {
      let user = await Users.findById(req.body.userId);
      if (user) {
        const checkPassword =
          crypto
            .createHash("sha256", secretKey)
            .update(req.body.password)
            .digest("hex") == user.password;
        if (!checkPassword) {
          return res.status(403).json({ message: "Mật khẩu không đúng" });
        }
        user.updatedTime = Date.now();
        user.password = crypto
          .createHash("sha256", secretKey)
          .update(req.body.newPassword)
          .digest("hex");

        let updatedUser = await Users.findOneAndUpdate(
          { _id: req.body.userId },
          user
        );
        return res.status(200).json(updatedUser);
      } else {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
    } catch (error) {
      let response = new ResponseModel(-2, error.message, error);
      res.json(response);
    }
  } else {
    res.sendStatus(403);
  }
}

async function getUserByRole(req, res) {
  let pageSize = req.query.pageSize || 10;
  let pageIndex = req.query.pageIndex || 1;
  if (!req.query.role) {
    let response = new ResponseModel(0, "role not be empty", null);
    return res.json(response);
  }

  let dataRole = await Roles.findOne({ roleName: req.query.role });
  if (!dataRole) {
    let response = new ResponseModel(0, "Role was not found!", null);
    return res.json(response);
  }

  let searchObj = {};
  searchObj.role = dataRole._id;
  if (req.query.search) {
    searchObj = { userName: { $regex: ".*" + req.query.search + ".*" } };
  }

  try {
    let users = await Users.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .sort({
        createdTime: "desc",
      });
    let count = await Users.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);
    let pagedModel = new PagedModel(
      pageIndex,
      pageSize,
      totalPages,
      users,
      count
    );
    res.json(pagedModel);
  } catch (error) {
    let response = new ResponseModel(404, error.message, error);
    res.status(404).json(response);
  }
}

async function getAllUser(req, res) {
  try {
    const result = await Users.find()
      .populate("role")
      .select("_id userName email role");
    return res.status(200).json({ users: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
}
module.exports.refreshToken = require("./refreshToken");
exports.getAllUser = getAllUser;
exports.login = login;
exports.insertUser = insertUser;
exports.updateUser = updateUser;
exports.register = register;
exports.deleteUser = deleteUser;
exports.getUserById = getUserById;
exports.getPaging = getPaging;
exports.forgotPassword = forgotPassword;
exports.changePassword = changePassword;
exports.getUserByRole = getUserByRole;
exports.getQrCode = getQrCode;
exports.verify2FaToken = verify2FaToken;
exports.login2Fa = login2Fa;
exports.getSurplus = getSurplus;
