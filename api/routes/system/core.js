const express = require("express");
const router = express.Router();
const coreController = require("../../controllers/system/core");

const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  coreController.createCore
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  coreController.deleteCore
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  coreController.updateCore
);
router.get("/getPaging", coreController.getPagingCore);

module.exports = router;
