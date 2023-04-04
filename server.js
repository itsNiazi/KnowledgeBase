// Importerar moduler/dependencies
const express = require("express");
const { Pool } = require("pg");

// Importerar inloggningsuppgifter från .env
require("dotenv").config();

const app = express();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Simpel kod som testar databasuppkoppling
(async () => {
  try {
    await pool.connect();
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection error", err);
  } finally {
    // End the database connection
    await pool.end();
  }
})();
