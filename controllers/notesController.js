const pool = require("../models/db");

function addNote(req, res) {
  res.render("pages/notes", { layout: "layouts/index" });
}

async function postNote(req, res) {
  try {
    const { title, category, content } = req.body;
    const userid = req.user.id;
    const created = new Date();
    const updated = created;
    console.log(title, category, content, userid);
    await pool.query(
      "INSERT INTO notes (user_id, title, content, category, created, updated) VALUES ($1, $2, $3, $4, $5, $6)",
      [userid, title, content, category, created, updated]
    );
    req.flash("success_msg", "Note added successfully");
    res.redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

module.exports = { addNote, postNote };
