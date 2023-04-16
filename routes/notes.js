const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/authController");

router.get("/add", checkNotAuthenticated, notesController.addNote);
router.post("/add", notesController.postNote);

module.exports = router;
