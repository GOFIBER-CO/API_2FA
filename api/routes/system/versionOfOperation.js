const express = require("express");
const router = express.Router();
const operatingController = require("../../controllers/system/operating");
const versionOfOperating = require("../../controllers/system/versionOfOperating");

const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  versionOfOperating.createVersionOfOperating
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  versionOfOperating.deleteVersionOfOperating
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  versionOfOperating.updateVersionOfOperating
);
router.get("/getPaging", versionOfOperating.getPagingVersionOfOperating);
router.get("/:id", versionOfOperating.getVersionOfOperatingById);
module.exports = router;
