const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const middlewares = require("./middlewares");

router.post("/insert", middlewares.authorize, tagController.createTag);
router.put("/update/:id", middlewares.authorize, tagController.updateTag);
router.delete("/delete/:id", middlewares.authorize, tagController.deleteTag);
router.get("/getById/:id", tagController.getTagById);
router.get("/getPaging", tagController.getPagingTags);
router.get("/getBySlug/:slug", tagController.getTagBySlug);

module.exports = router;
