const express = require("express");
const router = express.Router();
const supplierController = require("../../controllers/system/supplier");

const middlewares = require("../middlewares");

router.post(
  "/insert",
  //  middlewares.authorize,
  supplierController.createSupplier
);
router.get("/", (req, res) => {
  res.send(`hello`);
});
router.delete(
  "/delete/:id",
  //  middlewares.authorize,
  supplierController.deleteSupplier
);

router.put(
  "/update/:id",
  //  middlewares.authorize,
  supplierController.updateSupplier
);
router.get("/getPaging", supplierController.getPagingSupplier);

module.exports = router;
