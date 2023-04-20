const pool = require("../models/db");

// function getNote(req, res) {
//   res.render("pages/notes", { layout: "layouts/index" });
// }
function getNote(req, res) {
  res.render("pages/notes");
}

async function postNote(req, res) {
  try {
    const { title, category, content } = req.body;
    const userId = req.user.id;
    const created = new Date();
    const updated = created;
    console.log(title, category, content, userId);
    await pool.query(
      "INSERT INTO notes (user_id, title, content, category, created, updated) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, title, content, category, created, updated]
    );
    res.redirect("/users/dashboard/notes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function getUserNote(req, res) {
  function truncateText(text, limit) {
    const truncated = text.substring(0, limit);
    return text.length > limit ? truncated + "..." : truncated;
  }
  try {
    const userId = req.user.id;
    const notes = await pool.query(
      `SELECT * FROM notes WHERE user_id = $1 ORDER BY id ASC`,
      [userId]
    );
    res.render("pages/readNotes", { notes: notes.rows, truncateText });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

module.exports = { getNote, postNote, getUserNote };
