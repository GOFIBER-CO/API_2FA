const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController");
const middlewares = require("./middlewares");

// router.post("/insert", middlewares.authorize, appController.createApp);
// router.put("/update/:id", middlewares.authorize, appController.updateApp);
// router.delete("/delete/:id", middlewares.authorize, appController.deleteApp);
// router.get("/getById/:id", appController.getAppById);
// router.get("/getPaging", appController.getPagingApps);
// router.get("/getAll", appController.getAllApps);

router.post("/insert", appController.createApp);
router.put("/update/:id", middlewares.authorize, appController.updateApp);
router.delete("/delete/:id", middlewares.authorize, appController.deleteApp);
router.get("/getById/:id", appController.getAppById);
router.get("/getPaging", appController.getPagingApps);
router.get("/getAll", appController.getAllApps);

module.exports = router;
