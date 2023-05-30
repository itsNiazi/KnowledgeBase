// Imports dependencies && modules
const express = require("express");
const router = express.Router();
const achievementsController = require("../controllers/achievementsController");
const { checkNotAuthenticated } = require("../controllers/authController");
// const { use } = require("passport");

// Route && functions
router.get(
  "/",
  checkNotAuthenticated,
  achievementsController.getUserAchievements,
  achievementsController.getProgressColor,
  achievementsController.achievementProgress
);

module.exports = router;
