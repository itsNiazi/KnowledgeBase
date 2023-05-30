// Import modules
const pool = require("../models/db");

// Index route logic && custom layout
async function getIndex(req, res, next) {
  const allAchievements = await pool.query(
    "SELECT id, image_url, name, description, requirement FROM achievements"
  );
  achievements = allAchievements.rows.map((achievement) => {
    const className = "achievement-image-opaque";
    const progress = 100;
    return { ...achievement, className, progress };
  });
  res.render("pages/home", { achievements: achievements, layout: "layouts/index"});
}

module.exports = { getIndex };
