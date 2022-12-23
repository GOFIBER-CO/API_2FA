const express = require("express");
const router = express.Router();
const groupProfileController = require("../controllers/groupProfileController");
const middlewares = require("./middlewares");

router.post("/insert", middlewares.authentication, groupProfileController.createGroupProfile);
router.put("/delete-password/:id", middlewares.authentication, groupProfileController.deletePasswordGroupProfile);
router.put("/creat-password/:id", middlewares.authentication, groupProfileController.createPasswordGroupProfile);

router.get("/getPaging", groupProfileController.getPagingGroupProfile);
router.delete("/delete-group-profile", groupProfileController.deleteGroupProfile);

module.exports = router;