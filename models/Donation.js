/**
 * models/Donation.js — Donation model using SQLite (better-sqlite3)
 */

const { v4: uuidv4 } = require('uuid');
const db             = require('../config/database');

// Convert DB row (snake_case) → JS object (camelCase)
function rowToDonation(row) {
  if (!row) return null;
  return {
    id:            row.id,
    donorName:     row.donor_name,
    donorEmail:    row.donor_email,
    amount:        row.amount,
    message:       row.message,
    paymentMethod: row.payment_method,
    transactionId: row.transaction_id,
    status:        row.status,
    createdAt:     row.created_at,
  };
}

const Donation = {

  // ── Get all donations ─────────────────────────
  findAll() {
    return db.prepare('SELECT * FROM donations ORDER BY created_at DESC').all().map(rowToDonation);
  },

  // ── Find by ID ────────────────────────────────
  findById(id) {
    return rowToDonation(db.prepare('SELECT * FROM donations WHERE id = ?').get(id));
  },

  // ── Total amount raised ───────────────────────
  getTotalRaised() {
    const row = db.prepare(
      "SELECT SUM(amount) as total FROM donations WHERE status = 'completed'"
    ).get();
    return row.total || 0;
  },

  // ── Create donation ───────────────────────────
  create({ donorName, donorEmail, amount, message = '', paymentMethod = 'pending', transactionId = null }) {
    const id  = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO donations
        (id, donor_name, donor_email, amount, message, payment_method, transaction_id, status, created_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `).run(id, donorName, donorEmail, amount, message, paymentMethod, transactionId, now);

    return this.findById(id);
  },

  // ── Update donation status ────────────────────
  updateStatus(id, status, transactionId = null) {
    db.prepare(
      'UPDATE donations SET status = ?, transaction_id = COALESCE(?, transaction_id) WHERE id = ?'
    ).run(status, transactionId, id);
    return this.findById(id);
  },

};

module.exports = Donation;
