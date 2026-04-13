/**
 * models/Donation.js — Donation model using SQLite
 */

const { v4: uuidv4 } = require('uuid');
const db             = require('../config/database');

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
  findAll() {
    return db.prepare('SELECT * FROM donations ORDER BY created_at DESC').all().map(rowToDonation);
  },

  findById(id) {
    return rowToDonation(db.prepare('SELECT * FROM donations WHERE id = ?').get(id));
  },

  getTotalRaised() {
    const row = db.prepare("SELECT SUM(amount) as total FROM donations WHERE status = 'completed'").get();
    return row.total || 0;
  },

  create({ donorName, donorEmail, amount, message = '', paymentMethod = 'pending', transactionId = null }) {
    const id  = uuidv4();
    const now = new Date().toISOString();

    const db = require('../config/database');

const Donation = {
  async findAll() {
    const res = await db.query(
      'SELECT * FROM donations ORDER BY created_at DESC'
    );
    return res.rows;
  },

  async getTotalRaised() {
    const res = await db.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM donations'
    );
    return res.rows[0].total;
  }
};

module.exports = Donation;

  updateStatus(id, status, transactionId = null) {
    db.prepare('UPDATE donations SET status = ?, transaction_id = COALESCE(?, transaction_id) WHERE id = ?')
      .run(status, transactionId, id);
    return this.findById(id);
  },
};

module.exports = Donation;
