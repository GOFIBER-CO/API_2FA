const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const middlewares = require("./middlewares");

router.post("/insert", middlewares.authorize, menuController.createMenu);
router.put("/update/:id", middlewares.authorize, menuController.updateMenu);
router.delete("/delete/:id", middlewares.authorize, menuController.deleteMenu);
router.get("/getById/:id", menuController.getMenuById);
router.get("/getPaging", menuController.getPagingMenus);
router.get("/getAll", menuController.getAllMenus);
router.get(
  "/getMenuChildrenBySlug/:slug",
  menuController.getMenuChildrenBySlug
);
router.get("/getMenuByParent/:slug", menuController.getMenuByParent);
router.get(
  "/getAllMenuChildrenBySlug/:slug",
  menuController.getAllMenuChildrenBySlug
);
router.get("/getMenuBySlug/:slug", menuController.getMenuBySlug);
module.exports = router;
