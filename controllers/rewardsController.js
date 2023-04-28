const pool = require("../models/db");

function getRewards(req, res) {
  res.render("pages/achievements");
}

module.exports = {
  getRewards,
};
