// Imports dependencies && modules
const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

// Index page route
router.get("/", indexController.getIndex);

module.exports = router;
