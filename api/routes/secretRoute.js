const express = require("express");
const router = express.Router();
const secretController = require("../controllers/secretController");
const middlewares = require("./middlewares");

router.post(
  "/insert",
  middlewares.authentication,
  secretController.insertSecret
);
router.post(
  "/export",
  middlewares.authentication,
  secretController.exportSecret
);
router.post(
  "/delete",
  middlewares.authentication,
  secretController.deleteSecrets
);
router.put(
  "/updateUser/:id",
  middlewares.authentication,
  secretController.updateUserSecret
);
// router.put('/update/:id', middlewares.authentication,secretController.updateServer);
router.delete(
  "/delete/:id",
  middlewares.authentication,
  secretController.deleteSecret
);
router.get(
  "/getById/:id",
  middlewares.authentication,
  secretController.getSecretById
);
router.get(
  "/getQrCodeById/:id",
  middlewares.authentication,
  secretController.getQrCodeById
);
router.get(
  "/getPaging",
  middlewares.authentication,
  secretController.getPaging
);
router.get(
  "/import/:id",
  middlewares.authentication,
  secretController.importSecret
);
router.put(
  "/updateComment/:id",
  middlewares.authentication,
  secretController.updateCommentSecret
);

module.exports = router;
