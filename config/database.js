const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

// Real connection test (IMPORTANT)
pool.connect()
  .then(client => {
    console.log("[DB] PostgreSQL connected successfully");
    client.release();
  })
  .catch(err => {
    console.error("[DB] PostgreSQL connection error:", err.message);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
