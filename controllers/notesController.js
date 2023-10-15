// Imports dependecies && modules
const pool = require("../models/db");
const Fuse = require("fuse.js");

// Add notes form page
function getNote(req, res) {
  const note = {};
  res.render("pages/notes", { note });
}

// Submit notes form
async function postNote(req, res) {
  try {
    const { title, category, content } = req.body;
    const userId = req.user.id;
    const created = new Date();
    const updated = created;
    let note_image = null;

    if (req.file) {
      note_image = req.file.buffer;
    }

    await pool.query(
      "INSERT INTO notes (user_id, title, content, category, created, updated, note_image) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [userId, title, content, category, created, updated, note_image]
    );
    await pool.query("UPDATE users SET amount = amount + 1 WHERE id = $1", [
      userId,
    ]);
    await pool.query(
      "UPDATE users SET totalamount = totalamount + 1 WHERE id = $1",
      [userId]
    );
    res.redirect("/users/dashboard/notes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

// Display notes
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

// Sort notes
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

// View specific note
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

// Delete specific note
async function deleteNote(req, res) {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    await pool.query("UPDATE users SET amount = amount - 1 WHERE id = $1", [
      userId,
    ]);
    await pool.query("DELETE FROM notes WHERE id = $1", [noteId]);
    res.redirect("/users/dashboard/notes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

// Edit note form page
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

// Update edited note
async function updateNote(req, res) {
  try {
    const noteId = req.params.id;
    const updated = new Date();
    const { title, category, content } = req.body;

    const existingNote = await pool.query("SELECT * FROM notes WHERE id = $1", [
      noteId,
    ]);

    let note_image = null;

    if (req.file) {
      note_image = req.file.buffer;
    } else {
      note_image = existingNote.rows[0].note_image;
    }

    await pool.query(
      "UPDATE notes SET title = $1, content = $2, category = $3, note_image = $4, updated = $5 WHERE id = $6 ",
      [title, content, category, note_image, updated, noteId]
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

// Autocomplete fuzzy search
async function searchNote(req, res) {
  const userId = req.user.id;

  pool.query(
    `SELECT * FROM notes WHERE user_id = $1 ORDER BY title`,
    [userId],
    (error, result) => {
      if (error) {
        console.error("Error executing search query", error);
        res.sendStatus(500);
      } else {
        const notes = result.rows;
        res.send(notes);
      }
    }
  );
}

// Server rendered search results
async function searchServerNotes(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, title FROM notes WHERE user_id = $1",
      [req.user.id]
    );
    const options = {
      keys: ["title"],
      threshold: 0.3,
    };
    const fuse = new Fuse(result.rows, options);
    const searchResult = fuse.search(req.query.query);

    const notesWithLinks = searchResult.map((note) => ({
      id: note.item.id,
      title: note.item.title,
      link: `/users/dashboard/notes/${note.item.id}`,
    }));

    res.render("pages/search", { results: notesWithLinks });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
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
  searchNote,
  searchServerNotes,
};
