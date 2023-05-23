// Imports dependencies
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

const Fuse = require("fuse.js");

// Imports modules
const pool = require("./models/db");
const initializePassport = require("./config/passportConfig");
initializePassport(passport);

const app = express();
const port = 3000 || process.env.PORT;

// Static Files
app.use(express.static("public"));

// Template Engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//Middleware (urlencoded & json needed?)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const indexRoute = require("./routes/index");
const usersRoute = require("./routes/users");
const notesRoute = require("./routes/notes");
const rewardsRoute = require("./routes/profile");

app.use("/", indexRoute);
app.use("/users", usersRoute);
app.use("/users/dashboard/notes", notesRoute);
app.use("/users/profile", rewardsRoute);

app.get("/search", (req, res) => {
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
});

app.get("/search-results", async (req, res) => {
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
});

// 404 Page Not Found
app.get("*", (req, res) => {
  res.status(404).send("404 Page Not Found");
});

// Simple code that tests Database connection
(async () => {
  try {
    await pool.connect();
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection error", err);
  } finally {
    // Ends the Database connection
    // await pool.end();
  }
})();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
