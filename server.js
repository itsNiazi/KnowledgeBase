// Imports modules and dependencies
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const session = require("express-session");

// Imports login credentials from .env
require("dotenv").config();

const app = express();
const port = 3000;

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
    secret: "secret", //Need to use .env for this
    resave: false,
    saveUninitialized: false,
  })
);

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.get("/", (req, res) => {
  res.render("pages/");
});

app.get("/users/register", (req, res) => {
  res.render("pages/register");
});

app.get("/users/login", (req, res) => {
  res.render("pages/login");
});

app.get("/users/dashboard", (req, res) => {
  res.render("pages/dashboard", { user: "Doe" });
});

app.post("/users/register", async (req, res) => {
  let { username, password, password2 } = req.body;
  console.log({ username, password, password2 });

  let errors = [];
  if (!username || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ message: "Password should be atleast 6 characters" });
  }
  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }
  if (errors.length > 0) {
    res.render("pages/register", { errors });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        if (results.rows.length > 0) {
          errors.push({ message: "Username already registered" });
          res.render("pages/register", { errors });
        } else {
          pool.query(
            `INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING id, password`,
            [username, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
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
