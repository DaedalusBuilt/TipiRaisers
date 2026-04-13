/**
 * config/database.js — SQLite database setup via better-sqlite3
 *
 * TODO: For production with high concurrency, consider migrating to PostgreSQL.
 *       For now, SQLite + WAL mode handles typical community-site traffic well.
 */

const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH  = process.env.DB_PATH || path.join(DATA_DIR, 'tipirasers.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);

// Performance + safety settings
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    content     TEXT NOT NULL,
    excerpt     TEXT,
    category    TEXT,
    author      TEXT DEFAULT 'Admin',
    image_url   TEXT DEFAULT '',
    status      TEXT DEFAULT 'draft',
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS donations (
    id              TEXT PRIMARY KEY,
    donor_name      TEXT NOT NULL,
    donor_email     TEXT NOT NULL,
    amount          REAL NOT NULL,
    message         TEXT DEFAULT '',
    payment_method  TEXT DEFAULT 'pending',
    transaction_id  TEXT,
    status          TEXT DEFAULT 'pending',
    created_at      TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS volunteers (
    id               TEXT PRIMARY KEY,
    name             TEXT NOT NULL,
    email            TEXT NOT NULL UNIQUE,
    phone            TEXT DEFAULT '',
    interests        TEXT DEFAULT '[]',
    skills           TEXT DEFAULT '',
    message          TEXT DEFAULT '',
    available_hours  TEXT DEFAULT '',
    status           TEXT DEFAULT 'pending',
    created_at       TEXT NOT NULL
  );
`);

console.log('[DB] SQLite database ready:', DB_PATH);

module.exports = db;
