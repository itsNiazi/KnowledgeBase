// Imports dependencies && modules
const express = require("express");
const router = express.Router();
const achievementsController = require("../controllers/achievementsController");
const usersController = require("../controllers/usersController");
const { checkNotAuthenticated } = require("../controllers/authController");
// const { use } = require("passport");

// Route && functions
router.get(
  "/",
  checkNotAuthenticated,
  achievementsController.getUserAchievements,
  usersController.invokeGetImage,
  achievementsController.getProgressColor,
  achievementsController.achievementProgress
);

module.exports = router;
