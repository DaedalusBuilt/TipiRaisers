/**
 * config/database.js — PostgreSQL (Supabase / Render / Railway)
 *
 * This replaces SQLite completely.
 */

const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

// Optional debug (safe for Render logs)
console.log("[DB] PostgreSQL connected");

// Wrapper helpers (so your app doesn't break immediately)
module.exports = {
  // raw query interface (NEW STANDARD)
  query: (text, params) => pool.query(text, params),

  // optional compatibility helpers (so migration is easier)
  getClient: () => pool.connect(),
};
