// Imports dependencies
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
// const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

// Imports modules
const pool = require("./models/db");
const initializePassport = require("./config/passportConfig");
initializePassport(passport);

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const usersRoute = require("./routes/users");
app.use("/users", usersRoute);

// GET Routes
app.get("/", (req, res) => {
  res.render("pages/");
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
