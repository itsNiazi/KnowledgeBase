const pool = require("../models/db");
const Fuse = require("fuse.js");

function getNote(req, res) {
  res.render("pages/notes");
}

async function postNote(req, res) {
  try {
    const { title, category, content } = req.body;
    const userId = req.user.id;
    const created = new Date();
    const updated = created;
    await pool.query(
      "INSERT INTO notes (user_id, title, content, category, created, updated) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, title, content, category, created, updated]
    );
    await pool.query("UPDATE users SET amount = amount + 1 WHERE id = $1", [
      userId,
    ]);
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
    const { sortBy } = req.query;
    const userId = req.user.id;
    const notes = await pool.query(
      `SELECT * FROM notes WHERE user_id = $1 ORDER BY id DESC`,
      [userId]
    );
  
    res.render("pages/readNotes", {
      notes: notes.rows,
      truncateText,
      sortBy,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function sortNotes(req, res) {
  try {
    const userId = req.user.id;
    const { sortBy } = req.query;
    let query = "SELECT * FROM notes WHERE user_id = $1";

    // Sort the notes based on the selected criteria
    switch (sortBy) {
      case "titleAsc":
        query += " ORDER BY title ASC";
        break;
      case "titleDesc":
        query += " ORDER BY title DESC";
        break;
      case "dateAsc":
        query += " ORDER BY created ASC";
        break;
      case "dateDesc":
      default:
        query += " ORDER BY created DESC";
        break;
    }

    const result = await pool.query(query, [userId]);

    function truncateText(text, limit) {
      const truncated = text.substring(0, limit);
      return text.length > limit ? truncated + "..." : truncated;
    }
    res.render("pages/readNotes", { notes: result.rows, truncateText, sortBy });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getViewNote(req, res) {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const note = await pool.query(
      "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
      [noteId, userId]
    );
    if (note.rowCount === 0) {
      return res.status(403).send("You shall not pass!");
    }
    res.render("pages/viewNotes", { note: note.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function deleteNote(req, res) {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    await pool.query("UPDATE users SET amount = amount - 1 WHERE id = $1", [
      userId,
    ]);
    await pool.query("DELETE FROM notes WHERE id = $1", [noteId]);
    await pool.query("")
    res.redirect("/users/dashboard/notes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function editNote(req, res) {
  try {
    const noteId = req.params.id;
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [
      noteId,
    ]);
    const note = result.rows[0];
    res.render("pages/editNote", { note });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function updateNote(req, res) {
  try {
    const noteId = req.params.id;
    const updated = new Date();
    const { title, category, content } = req.body;
    await pool.query(
      "UPDATE notes SET title = $1, content = $2, category = $3, updated = $4 WHERE id = $5 ",
      [title, content, category, updated, noteId]
    );
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [
      noteId,
    ]);
    const updatedNote = result.rows[0];
    res.render("pages/viewNotes", { note: updatedNote });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}


module.exports = {
  getNote,
  postNote,
  getUserNote,
  getViewNote,
  deleteNote,
  editNote,
  updateNote,
  sortNotes,
};
