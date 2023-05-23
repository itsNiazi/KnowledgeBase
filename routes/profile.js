const express = require("express");
const router = express.Router();
const achievementsController = require("../controllers/achievementsController");
const usersController = require("../controllers/usersController");
const multer = require('multer');
const upload = multer({ dest: '/images/avatars' });
const { checkNotAuthenticated } = require("../controllers/authController");
const { use } = require("passport");

router.get("/", checkNotAuthenticated, achievementsController.getUserAchievements, usersController.invokeGetImage, achievementsController.getProgressColor, achievementsController.achievementProgress);
router.post("/upload", checkNotAuthenticated, upload.single('avatar'), usersController.uploadImage);
router.post("/delete", checkNotAuthenticated, usersController.deleteImage);

module.exports = router;
