/**
 * config/database.js — PostgreSQL connection pool (via pg)
 * Works with Supabase, Render Postgres, or any PostgreSQL provider.
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(async (client) => {
    console.log('[DB] PostgreSQL connected successfully');
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL, excerpt TEXT, category TEXT,
        author TEXT DEFAULT 'Admin', image_url TEXT DEFAULT '',
        status TEXT DEFAULT 'draft', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS donations (
        id TEXT PRIMARY KEY, donor_name TEXT NOT NULL, donor_email TEXT NOT NULL,
        amount NUMERIC NOT NULL, message TEXT DEFAULT '', payment_method TEXT DEFAULT 'pending',
        transaction_id TEXT, status TEXT DEFAULT 'pending', created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS volunteers (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
        phone TEXT DEFAULT '', interests TEXT DEFAULT '[]', skills TEXT DEFAULT '',
        message TEXT DEFAULT '', available_hours TEXT DEFAULT '',
        status TEXT DEFAULT 'pending', created_at TEXT NOT NULL
      );
    `);
    console.log('[DB] Tables verified / created.');
    client.release();
  })
  .catch(err => {
    console.error('[DB] PostgreSQL connection error:', err.message);
    console.error('     Make sure DATABASE_URL is set in your .env or Render environment variables.');
  });

module.exports = {
  query:     (text, params) => pool.query(text, params),
  getClient: ()             => pool.connect(),
};
