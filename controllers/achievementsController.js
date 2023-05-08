const pool = require("../models/db");

async function getUserAchievements(req, res) {
  try {
    const userId = req.user.id;
    const user_amount = await pool.query("SELECT amount FROM users WHERE id = $1", [userId]);
    const amount = user_amount.rows[0].amount;

    if (amount >= 5) {
      await pool.query(
        "INSERT into user_achievements (user_id, achievement_id) SELECT $1, 2 WHERE NOT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = $1 AND achievement_id = 2)",
        [userId]
      );
    }

    const userAchievements = await pool.query("SELECT id, image_url, name FROM achievements WHERE id IN (SELECT achievement_id FROM user_achievements WHERE user_id = $1)", [userId]);
    let achievements = [];

    const userAchievementIds = userAchievements.rows.map((achievement) => achievement.id);
    const allAchievements = await pool.query("SELECT id, image_url, name, description FROM achievements");
    achievements = allAchievements.rows.map((achievement) => {
      let opacity = 0.4;
      if (userAchievementIds.includes(achievement.id)) {
        opacity = 1;
      }
      return { ...achievement, opacity };
    });
    
    console.log(achievements);
    res.render("pages/achievements", { achievements });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  getUserAchievements
};