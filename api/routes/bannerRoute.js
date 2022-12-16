const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const middlewares = require("./middlewares");

router.post("/insert", middlewares.authorize, bannerController.createBanner);
router.put("/update/:id", middlewares.authorize, bannerController.updateBanner);
router.delete(
  "/delete/:id",
  middlewares.authorize,
  bannerController.deleteBanner
);
router.get("/getById/:id", bannerController.getBannerById);
router.get("/getPaging", bannerController.getPagingBanners);

module.exports = router;
