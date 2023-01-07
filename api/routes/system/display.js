const express = require("express");
const router = express.Router();
const displayController = require("../../controllers/system/display");

const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  displayController.createDisplay
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  displayController.deleteDisplay
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  displayController.updateDisplay
);
router.get("/getPaging", displayController.getPagingDisplay);

module.exports = router;
