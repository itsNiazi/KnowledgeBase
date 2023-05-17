const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const multer = require('multer');
const upload = multer({ dest: '/images/avatars' });
const achievementsController = require("../controllers/achievementsController");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/authController");

router.get("/register", checkAuthenticated, usersController.getRegister);
router.get("/login", checkAuthenticated, usersController.getLogin);
router.get("/dashboard", checkNotAuthenticated, usersController.getDashboard);
router.post("/upload", checkNotAuthenticated, upload.single('avatar'), usersController.uploadImage);
router.post("/delete", checkNotAuthenticated, usersController.deleteImage);
router.get("/achievements", checkNotAuthenticated, achievementsController.getUserAchievements);
router.get("/logout", usersController.getLogout);
router.post("/register", usersController.postRegister);
router.post("/login", usersController.postLogin);

module.exports = router;
