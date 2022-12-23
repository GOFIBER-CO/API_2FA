const express = require("express");
const router = express.Router();
const userController = require("../../controllers/authentication/userController");
const middlewares = require("../middlewares");

router.post("/login", userController.login);
router.post("/insert", userController.insertUser);
router.post("/register", userController.register);
router.put(
  "/update/:id",
  middlewares.authentication,
  userController.updateUser
);
router.put(
  "/updateSocket/:id",
  middlewares.authentication,
  userController.updateSocketUser
);

router.put(
  "/updateResetSocket/:id",
  middlewares.authentication,
  userController.resetSocketUser
);
router.delete("/delete/:id", middlewares.authorize, userController.deleteUser);
router.post("/getById", middlewares.authentication, userController.getUserById);
router.post(
  "/getByEmail",
  middlewares.authentication,
  userController.getUserByEmail
);
router.get("/getPaging", middlewares.authorize, userController.getPaging);
router.post(
  "/forgotPassword",
  middlewares.authorize,
  userController.forgotPassword
);
router.post(
  "/changePassword",
  middlewares.authentication,
  userController.changePassword
);
router.get(
  "/getUserByRole",
  middlewares.authorize,
  userController.getUserByRole
);
router.get(
  "/getQrCode/:id",
  middlewares.authentication,
  userController.getQrCode
);
router.post(
  "/verify2FaToken",
  middlewares.authentication,
  userController.verify2FaToken
);
router.post("/login2Fa", middlewares.authentication, userController.login2Fa);
router.get(
  "/surplus/:id",
  middlewares.authentication,
  userController.getSurplus
);
router.get("/getAllUser", middlewares.authorize, userController.getAllUser);
router.get("/refreshToken", userController.refreshToken);

module.exports = router;
