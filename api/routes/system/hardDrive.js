const express = require("express");
const router = express.Router();
const hardDriveController = require("../../controllers/system/hardDrive");

const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  hardDriveController.createHardDrive
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  hardDriveController.deleteHardDrive
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  hardDriveController.updateHardDrive
);
router.get("/getPaging", hardDriveController.getPagingHardDrive);

module.exports = router;
