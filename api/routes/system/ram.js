const express = require("express");
const router = express.Router();
const ramController = require("../../controllers/system/ram");
const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  ramController.createRam
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  ramController.deleteRam
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  ramController.updateRam
);
router.get("/getPaging", ramController.getPagingRam);

module.exports = router;
