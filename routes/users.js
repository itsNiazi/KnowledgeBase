const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const achievementsController = require("../controllers/achievementsController");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/authController");
const passport = require("passport");

router.get("/register", checkAuthenticated, usersController.getRegister);
router.get("/login", checkAuthenticated, usersController.getLogin);
router.get("/dashboard", checkNotAuthenticated, usersController.getDashboard);
router.get("/achievements", checkNotAuthenticated, achievementsController.getUserAchievements);
router.get("/logout", usersController.getLogout);
router.post("/register", usersController.postRegister);
router.post("/login", usersController.postLogin);

module.exports = router;
