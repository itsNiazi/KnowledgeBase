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
  res.render("pages/index");
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

// Simple code that tests Database connection
(async () => {
  try {
    await pool.connect();
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection error", err);
  } finally {
    // Ends the Database connection
    await pool.end();
  }
})();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
