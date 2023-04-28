const express = require("express");
const router = express.Router();
const rewardsController = require("../controllers/rewardsController");
const { checkNotAuthenticated } = require("../controllers/authController");

router.get("/", checkNotAuthenticated, rewardsController.getRewards);

module.exports = router;
