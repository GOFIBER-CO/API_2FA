const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const middlewares = require("./middlewares");

router.post("/insert", middlewares.authorize, groupController.createGroup);
router.put("/update/:id", middlewares.authorize, groupController.updateGroup);
router.delete(
  "/delete/:id",
  middlewares.authorize,
  groupController.deleteGroup
);
router.get("/getById/:id", groupController.getGroupById);
router.get("/getPaging", groupController.getPagingGroups);

module.exports = router;
