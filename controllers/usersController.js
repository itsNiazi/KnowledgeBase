const bcrypt = require("bcrypt");
const passport = require("passport");
const pool = require("../models/db");

function getRegister(req, res) {
  res.render("pages/register");
}

function getLogin(req, res) {
  res.render("pages/login", { message: req.flash("message") });
}

function getDashboard(req, res) {
  res.render("pages/dashboard", { user: req.user.username });
}

function getLogout(req, res) {
  req.logOut(() => {
    res.redirect("/users/login");
  });
}

async function postRegister(req, res) {
  let { username, password, password2 } = req.body;
  console.log({ username, password, password2 });

  let errors = [];
  if (!username || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
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
          errors.push({ message: "Username already exists" });
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
}

function postLogin(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
}

module.exports = {
  getRegister,
  getLogin,
  getDashboard,
  getLogout,
  postRegister,
  postLogin,
};