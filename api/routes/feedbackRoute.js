const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const middlewares = require("./middlewares");

router.post(
  "/insert",
  middlewares.authorize,
  feedbackController.createFeedback
);
router.get(
  "/getAllFeedbacks",
  middlewares.authorize,
  feedbackController.getAllFeedbacks
);
router.delete(
  "/delete/:id",
  middlewares.authorize,
  feedbackController.deleteFeedback
);
router.get(
  "/getPaging",
  middlewares.authorize,
  feedbackController.getPagingFeedbacks
);
// /api/feedback/getPaging
router.put("/update/:id", feedbackController.updateFeedback);
// router.get("/getById/:id", menuController.getMenuById);
// router.get("/getPaging", menuController.getPagingMenus);

module.exports = router;
