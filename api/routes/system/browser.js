const express = require("express");
const router = express.Router();
const browserController = require("../../controllers/system/browser");
const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  browserController.createBrowser
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  browserController.deleteBrowser
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  browserController.updateBrowser
);
router.get("/getPaging", browserController.getPagingBrowser);

module.exports = router;
