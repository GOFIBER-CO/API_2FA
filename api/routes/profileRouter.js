const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const middlewares = require("./middlewares");

router.post("/insert", middlewares.authentication, profileController.createProfile);

router.get("/getPaging", profileController.getPagingProfile);

module.exports = router;