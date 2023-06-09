// Imports dependencies
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

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

// Middleware
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

// Routes
const indexRoute = require("./routes/index");
const usersRoute = require("./routes/users");
const notesRoute = require("./routes/notes");
const rewardsRoute = require("./routes/achievements");

app.use("/", indexRoute);
app.use("/users", usersRoute);
app.use("/users/dashboard/notes", notesRoute);
app.use("/users/dashboard/achievements", rewardsRoute);

// 404 Page Not Found
app.get("*", (req, res) => {
  res.status(404).send("404 Page Not Found");
});

// Server init
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
