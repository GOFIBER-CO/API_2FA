const express = require("express");
const router = express.Router();
const ramController = require("../../controllers/system/ram");
const proxyController = require("../../controllers/system/proxy");

const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  proxyController.createProxy
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  proxyController.deleteProxy
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  proxyController.updateProxy
);
router.get("/getPaging", proxyController.getPagingProxy);

module.exports = router;
