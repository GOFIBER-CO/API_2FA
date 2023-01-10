const express = require("express");
const router = express.Router();
const languageController = require("../../controllers/system/language");

const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  languageController.createLanguageModel
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  languageController.deleteLanguageModel
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  languageController.updateLanguageModel
);
router.get("/getPaging", languageController.getPagingLanguageModel);

module.exports = router;
