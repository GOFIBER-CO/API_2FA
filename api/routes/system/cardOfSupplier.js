const express = require("express");
const router = express.Router();
const operatingController = require("../../controllers/system/operating");
const versionOfOperating = require("../../controllers/system/versionOfOperating");
const card = require("../../controllers/system/card");

const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  card.createCard
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  card.deleteCard
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  card.updateCard
);
router.get("/getPaging", card.getPagingCard);
router.get("/:id", card.getCardById);
module.exports = router;
