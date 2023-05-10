const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const { checkNotAuthenticated } = require("../controllers/authController");

router.get("/", checkNotAuthenticated, notesController.getUserNote);
router.get("/add", checkNotAuthenticated, notesController.getNote);
router.post("/add", notesController.postNote);
router.get("/search", checkNotAuthenticated, notesController.searchNote);
router.get("/:id", checkNotAuthenticated, notesController.getViewNote);
router.post("/:id", checkNotAuthenticated, notesController.deleteNote);
router.get("/:id/edit", checkNotAuthenticated, notesController.editNote);
router.post("/:id/edit", notesController.updateNote);

module.exports = router;
