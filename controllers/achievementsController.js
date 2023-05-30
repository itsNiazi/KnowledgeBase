// Import modules
const pool = require("../models/db");

// Check && Update user achievements
async function getUserAchievements(req, res, next) {
  try {
    const userId = req.user.id;
    const user_amount = await pool.query(
      "SELECT amount FROM users WHERE id = $1",
      [userId]
    );
    const amount = user_amount.rows[0].amount;
    if (amount >= 1) {
      await pool.query(
        "INSERT into user_achievements (user_id, achievement_id) SELECT $1, 1 WHERE NOT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = $1 AND achievement_id = 1)",
        [userId]
      );
    }
    if (amount >= 5) {
      await pool.query(
        "INSERT into user_achievements (user_id, achievement_id) SELECT $1, 2 WHERE NOT EXISTS(SELECT 2 FROM user_achievements WHERE user_id = $1 AND achievement_id = 2)",
        [userId]
      );
    }
    if (amount >= 10) {
      await pool.query(
        "INSERT into user_achievements (user_id, achievement_id) SELECT $1, 3 WHERE NOT EXISTS(SELECT 3 FROM user_achievements WHERE user_id = $1 AND achievement_id = 3)",
        [userId]
      );
    }
    if (amount >= 25) {
      await pool.query(
        "INSERT into user_achievements (user_id, achievement_id) SELECT $1, 4 WHERE NOT EXISTS(SELECT 4 FROM user_achievements WHERE user_id = $1 AND achievement_id = 4)",
        [userId]
      );
    }

    const userAchievements = await pool.query(
      "SELECT id, image_url, name FROM achievements WHERE id IN (SELECT achievement_id FROM user_achievements WHERE user_id = $1)",
      [userId]
    );
    let achievements = [];

    const userAchievementIds = userAchievements.rows.map(
      (achievement) => achievement.id
    );
    const allAchievements = await pool.query(
      "SELECT id, image_url, name, description, requirement FROM achievements"
    );
    achievements = allAchievements.rows.map((achievement) => {
      const isUserAchievement = userAchievementIds.includes(achievement.id);
      const className = isUserAchievement
        ? "achievement-image-opaque"
        : "achievement-image-transparent";
      return { ...achievement, className };
    });

    const currentDate = new Date();
    const { rows } = await pool.query(
      "SELECT dateJoined FROM users WHERE id = $1",
      [userId]
    );
    const dateJoined = new Date(rows[0].datejoined);
    const diffDays = Math.floor(
      (currentDate - dateJoined) / (1000 * 60 * 60 * 24)
    );
    if (diffDays >= 1) {
      await pool.query(
        "INSERT into user_achievements (user_id, achievement_id) SELECT $1, 5 WHERE NOT EXISTS(SELECT 5 FROM user_achievements WHERE user_id = $1 AND achievement_id = 5)",
        [userId]
      );
    }

    if (diffDays >= 7) {
      await pool.query(
        "INSERT into user_achievements (user_id, achievement_id) SELECT $1, 6 WHERE NOT EXISTS(SELECT 6 FROM user_achievements WHERE user_id = $1 AND achievement_id = 6)",
        [userId]
      );
    }

    if (diffDays >= 30) {
      await pool.query(
        "INSERT into user_achievements (user_id, achievement_id) SELECT $1, 7 WHERE NOT EXISTS(SELECT 7 FROM user_achievements WHERE user_id = $1 AND achievement_id = 7)",
        [userId]
      );
    }

    if (diffDays >= 90) {
      await pool.query(
        "INSERT into user_achievements (user_id, achievement_id) SELECT $1, 8 WHERE NOT EXISTS(SELECT 8 FROM user_achievements WHERE user_id = $1 AND achievement_id = 8)",
        [userId]
      );
    }

    const achievementsWithProgress = achievements.map((achievement) => {
      const progress = Math.round(
        achievementProgress(achievement.id, amount, diffDays)
      );
      if (userAchievementIds.includes(achievement.id)) {
        return { ...achievement, progress: 100 };
      } else {
        return { ...achievement, progress };
      }
    });

    res.locals.achievements = achievementsWithProgress;
    res.render("pages/achievements", { 
      achievements: achievementsWithProgress, 
      getProgressColor: getProgressColor 
  });
  
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

// Return className for user progress
function getProgressColor(progress) {
  if (progress <= 25) {
    return "red";
  } else if (progress <= 50) {
    return "orange";
  } else if (progress <= 75) {
    return "yellow";
  } else {
    return "green";
  }
}

function achievementProgress(achievementId, amount, diffDays) {
  switch (achievementId) {
    case 1:
      return Math.min((amount / 1) * 100, 100);
    case 2:
      return Math.min((amount / 5) * 100, 100);
    case 3:
      return Math.min((amount / 10) * 100, 100);
    case 4:
      return Math.min((amount / 25) * 100, 100);
    case 5:
      return Math.min((diffDays / 1) * 100, 100);
    case 6:
      return Math.min((diffDays / 7) * 100, 100);
    case 7:
      return Math.min((diffDays / 30) * 100, 100);
    case 8:
      return Math.min((diffDays / 90) * 100, 100);
    default:
      return 0;
  }
}

module.exports = {
  getUserAchievements,
  getProgressColor,
  achievementProgress,
};
