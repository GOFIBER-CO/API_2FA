const jwt = require("jsonwebtoken");
const ResponseModel = require("../models/ResponseModel");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

async function authorize(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    jwt.verify(token, secretKey, async (err, authorizedData) => {
      if (err) {
        let response = new ResponseModel(403, err.message, err);
        res.status(403).json(response);
      } else {
        if (authorizedData.role?._id) {
          let actions = await RoleActions.find({
            role: authorizedData.role?._id,
          }).populate("action");
          req.actions = actions.map((x) => x.action.actionName);
          req.userId = authorizedData._id;
          next();
        } else {
          res.sendStatus(403);
        }
      }
    });
  } else {
    res.sendStatus(403);
  }
}
async function authentication(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    try {
      const checkAuthentication = jwt.verify(token, secretKey);
      //   console.log(checkAuthentication);
      if (checkAuthentication) {
        req.user = checkAuthentication;
        next();
      } else {
        return res
          .status(401)
          .json({ message: "Chưa được đăng nhập vui lòng đăng nhập lại" });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: error });
    }
  } else {
    res.sendStatus(403);
  }
}

exports.authentication = authentication;
exports.authorize = authorize;
