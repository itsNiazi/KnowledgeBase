// Imports dependencies
const { Pool } = require("pg");

// Imports login credentials from .env
require("dotenv").config();

// Environment variables
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = pool;
