/**
 * models/Donation.js — Donation model using PostgreSQL
 */
const { v4: uuidv4 } = require('uuid');
const db             = require('../config/database');

function rowToDonation(row) {
  if (!row) return null;
  return {
    id: row.id, donorName: row.donor_name, donorEmail: row.donor_email,
    amount: parseFloat(row.amount), message: row.message,
    paymentMethod: row.payment_method, transactionId: row.transaction_id,
    status: row.status, createdAt: row.created_at,
  };
}

const Donation = {
  async findAll() {
    const res = await db.query('SELECT * FROM donations ORDER BY created_at DESC');
    return res.rows.map(rowToDonation);
  },
  async findById(id) {
    const res = await db.query('SELECT * FROM donations WHERE id=$1', [id]);
    return rowToDonation(res.rows[0]);
  },
  async getTotalRaised() {
    const res = await db.query("SELECT COALESCE(SUM(amount),0) AS total FROM donations WHERE status='completed'");
    return parseFloat(res.rows[0].total) || 0;
  },
  async create({ donorName, donorEmail, amount, message='', paymentMethod='pending', transactionId=null }) {
    const id  = uuidv4();
    const now = new Date().toISOString();
    await db.query(
      "INSERT INTO donations (id,donor_name,donor_email,amount,message,payment_method,transaction_id,status,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8)",
      [id, donorName, donorEmail, amount, message, paymentMethod, transactionId, now]
    );
    return this.findById(id);
  },
  async updateStatus(id, status, transactionId=null) {
    await db.query('UPDATE donations SET status=$1, transaction_id=COALESCE($2,transaction_id) WHERE id=$3', [status, transactionId, id]);
    return this.findById(id);
  },
};

module.exports = Donation;
