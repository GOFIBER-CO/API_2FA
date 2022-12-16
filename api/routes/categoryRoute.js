const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const middlewares = require("./middlewares");

router.post(
  "/insert",
  middlewares.authorize,
  categoryController.createCategory
);
router.put(
  "/update/:id",
  middlewares.authorize,
  categoryController.updateCategory
);
router.delete(
  "/delete/:id",
  middlewares.authorize,
  categoryController.deleteCategory
);
router.get("/getById/:id", categoryController.getCategoryById);
router.get("/getPaging", categoryController.getPagingCategories);

module.exports = router;
