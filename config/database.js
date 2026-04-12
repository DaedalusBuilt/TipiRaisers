/**
 * database.js — JSON flat-file data store
 * 
 * TODO: Replace with a real database driver when scaling up.
 *       Recommended options:
 *         - MongoDB + Mongoose (flexible, great for blog content)
 *         - PostgreSQL + Sequelize or Prisma (relational, robust)
 *         - SQLite (simple, file-based, good for small deployments)
 * 
 * For now we read/write JSON files in /data for simplicity.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readJSON, writeJSON };
