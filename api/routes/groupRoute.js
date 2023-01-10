const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const middlewares = require("./middlewares");

router.post("/insert", middlewares.authentication, groupController.createGroup);

router.post(
  "/delete",
  middlewares.authentication,
  groupController.deleteMultiGroup
);
router.put("/update/:id", middlewares.authorize, groupController.updateGroup);
router.put(
  "/updateUser",
  middlewares.authentication,
  groupController.updateUserGroup
);
router.delete(
  "/delete/:id",
  middlewares.authorize,
  groupController.deleteGroup
);
router.get("/getById/:id", groupController.getGroupById);
router.get(
  "/getPaging",
  middlewares.authentication,
  groupController.getPagingGroups
);
router.get(
  "/getByUser",
  middlewares.authentication,
  groupController.getGroupByUser
);

module.exports = router;
