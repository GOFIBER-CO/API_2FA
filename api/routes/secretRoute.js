const express = require("express");
const router = express.Router();
const secretController = require("../controllers/secretController");
const middlewares = require("./middlewares");

router.post(
  "/insert",
  middlewares.authentication,
  secretController.insertSecret
);
// router.put('/update/:id', middlewares.authentication,secretController.updateServer);
// router.delete('/delete/:id', middlewares.authorize,secretController.deleteServer);
// router.post('/getById', middlewares.authentication,secretController.getServerById);
router.get(
  "/getPaging",
  middlewares.authentication,
  secretController.getPaging
);

module.exports = router;
