const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const middleware = require("./middlewares");

// router.post("/insert", middleware.authorize, profileController.createProfile);
router.post("/insert", middleware.authorize, profileController.createProfile);
router.delete("/delete/:id", profileController.deleteProfile);
router.get(
  "/getPaging",
  middleware.authentication,
  profileController.getPagingProfile
);
router.get("/getPagingNoGroup", profileController.getPagingProfileNoGroup);
router.put("/update/:id", profileController.updateProfile);
router.put("/updateDuration/:id", profileController.durationProfile);
router.put("/updateUserInProfile/:id", profileController.updateUserInProfile);
router.put("/transferProfile/:id", profileController.tranferProfile);
router.put(
  "/copyProfile/:id",
  middleware.authentication,
  profileController.copyProfile
);
router.get("/getById/:id", profileController.getProfileById);
router.get(
  "/startBrower/:id",
  middleware.authentication,
  profileController.startBrower
);
router.get(
  "/endBrower/:id",
  middleware.authentication,
  profileController.endBrower
);
// router.put("/update/:id", middleware.authorize, menuController.updateMenu);
// router.delete("/delete/:id", middleware.authorize, menuController.deleteMenu);
// router.get("/getPaging", menuController.getPagingMenus);
// router.get("/getAll", menuController.getAllMenus);
// router.get(
//   "/getMenuChildrenBySlug/:slug",
//   menuController.getMenuChildrenBySlug
// );
// router.get("/getMenuByParent/:slug", menuController.getMenuByParent);
// router.get(
//   "/getAllMenuChildrenBySlug/:slug",
//   menuController.getAllMenuChildrenBySlug
// );
// router.get("/getMenuBySlug/:slug", menuController.getMenuBySlug);
module.exports = router;
