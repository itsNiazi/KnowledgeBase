const express = require("express");
const router = express.Router();
const achievementsController = require("../controllers/achievementsController");
const { checkNotAuthenticated } = require("../controllers/authController");

router.get("/", checkNotAuthenticated, achievementsController.getUserAchievements);

module.exports = router;