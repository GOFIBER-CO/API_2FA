const express = require("express");
const router = express.Router();
const operatingController = require("../../controllers/system/operating");
const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  operatingController.createOperating
);
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  operatingController.deleteOperating
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  operatingController.updateOperating
);
router.get("/getPaging", operatingController.getPagingOperating);
router.get("/getById/:id", operatingController.getOperatingById);

module.exports = router;
