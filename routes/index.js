// Imports dependencies && modules
const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const achievementsController = require("../controllers/achievementsController");

// Index page route
router.get("/", indexController.getIndex, achievementsController.getUserAchievements);

module.exports = router;
