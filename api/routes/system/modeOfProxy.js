const express = require("express");
const router = express.Router();
const modeOfProxyController = require("../../controllers/system/modeOfProxy");

const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  modeOfProxyController.createModeOfProxy
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  modeOfProxyController.deleteModeOfProxy
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  modeOfProxyController.updateModeOfProxy
);
router.get("/getPaging", modeOfProxyController.getPagingModeOfProxy);

module.exports = router;
