const express = require("express");
const router = express.Router();
const middlewares = require("./middlewares");
const schemaController = require("../controllers/schemaController");

router.post("/insert", middlewares.authorize, schemaController.createSchema);
router.put("/update/:id", middlewares.authorize, schemaController.updateSchema);
router.delete(
  "/delete/:id",
  middlewares.authorize,
  schemaController.deleteSchema
);
router.get("/getAll", schemaController.getAllSchema);
router.get("/getPaging", schemaController.getPagingSchema);
router.get("/getByPost/:slug", schemaController.getSchemaByPost);
router.get("/getByPage/:slug", schemaController.getSchemaByPage);
module.exports = router;
