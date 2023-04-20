const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/authController");

router.get("/", checkNotAuthenticated, notesController.getUserNote);
router.get("/add", checkNotAuthenticated, notesController.getNote);
router.post("/add", notesController.postNote);
router.get("/:id", checkNotAuthenticated, notesController.getViewNote);
router.post("/:id", checkNotAuthenticated, notesController.deleteNote);

module.exports = router;
