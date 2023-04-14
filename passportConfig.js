const LocalStrategy = require("passport-local").Strategy;
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

function initialize(passport) {
  const authenticateUser = (username, password) => {
    pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username],
      (err, results) => {
        if (err) {
          throw err;
        }
      }
    );
  };
  passport.use(
    new LocalStrategy({
      usernameField: "username",
      passwordField: "password",
    })
  );
}
