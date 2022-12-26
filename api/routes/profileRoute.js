const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const middleware = require("./middlewares");

// router.post("/insert", middleware.authorize, profileController.createProfile);
router.post("/insert", profileController.createProfile);
router.delete("/delete/:id", profileController.deleteProfile);
router.get("/getPaging", profileController.getPagingProfile);
router.put("/update/:id", profileController.updateProfile);
router.get("/getById/:id", profileController.getProfileById);
router.get("/getByGroup/:id", profileController.getProfileByGroup);
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
