const bcrypt = require("bcrypt");
const passport = require("passport");
const pool = require("../models/db");
const fs = require("fs");
const path = require("path");
const achievementsController = require("./achievementsController");



function getRegister(req, res) {
  res.render("pages/register", { layout: "layouts/index" });
}

function getLogin(req, res) {
  res.render("pages/login", {
    layout: "layouts/index",
    message: req.flash("message"),
  });
}

async function invokeGetImage(req, res) {
  const achievements = res.locals.achievements;

  try {
    await getImage(req, res, achievements);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function getImage(req, res) {
  const userId = req.user.id;
  const result = await pool.query("SELECT profileImage FROM users WHERE id = $1",
    [userId]
  );
  const profilePhoto = result.rows[0].profileimage;
  const imagePath = "/images/avatars/" + profilePhoto;

  const user_amount = await pool.query(
    "SELECT amount FROM users WHERE id = $1",
    [userId]
  );
  const amount = user_amount.rows[0].amount;
  let welcomeText;
  if (amount == 0) {
    welcomeText = "You don't have any notes yet.";
  }
  else if (amount == 1) {
    welcomeText = "You currently have only one note.";
  }
  else {
    welcomeText = `You currently have ${amount} notes.`;
  }
  
  res.render("pages/profile", { 
    user: req.user.username, 
    welcomeText, 
    profileImage: imagePath, 
    getProgressColor: achievementsController.getProgressColor 
});
}

function getLogout(req, res) {
  req.logOut(() => {
    res.redirect("/");
  });
}

async function getDashboard(req, res) {
  userId = req.user.id;
  res.render("pages/dashboard", { user: req.user.username });
}

async function postRegister(req, res) {
  let { username, password, password2 } = req.body;
  const dateJoined = new Date();

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
    res.render("pages/register", { errors, layout: "layouts/index" });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username],
      (err, results) => {
        if (err) {
          throw err;
        }
        if (results.rows.length > 0) {
          errors.push({ message: "Username already exists" });
          res.render("pages/register", { errors, layout: "layouts/index" });
        } else {
          pool.query(
            `INSERT INTO users (username, password, datejoined)
            VALUES ($1, $2, $3)
            RETURNING id, password`,
            [username, hashedPassword, dateJoined],
            (err, results) => {
              if (err) {
                throw err;
              }
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

async function uploadImage(req, res) {

  const userId = req.user.id;
  const avatar = req.file;
  let randomFileName = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 48; i++) {
    randomFileName += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const fileExtension = path.extname(avatar.originalname);
  randomFileName += fileExtension;
  const filePath = path.join('public', 'images', 'avatars', randomFileName);

  try {
    fs.copyFileSync(avatar.path, filePath);
    await pool.query("UPDATE users SET profileimage = $1 WHERE id = $2", [randomFileName, userId]);

    return res.redirect("profile");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }
}

async function deleteImage(req, res) {
  const userId = req.user.id;
  const result = await pool.query("SELECT profileimage FROM USERS where ID = $1", [userId]);
  const profileImage = result.rows[0].profileimage;


  try {
    if (profileImage != "profile.png") {
      const filePath = path.join('public', 'images', 'avatars', profileImage);
      console.log(filePath);
      fs.unlinkSync(filePath);
      await pool.query("UPDATE users SET profileimage = 'profile.png' WHERE id = $1", [userId]);
    }

    return res.redirect("profile");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }

}


module.exports = {
  getRegister,
  getLogin,
  invokeGetImage,
  getImage,
  getLogout,
  getDashboard,
  postRegister,
  postLogin,
  uploadImage,
  deleteImage
};
