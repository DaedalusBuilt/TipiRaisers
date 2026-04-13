/**
 * models/Volunteer.js — Volunteer model using PostgreSQL
 */
const { v4: uuidv4 } = require('uuid');
const db             = require('../config/database');

function rowToVolunteer(row) {
  if (!row) return null;
  return {
    id: row.id, name: row.name, email: row.email, phone: row.phone,
    interests: JSON.parse(row.interests || '[]'), skills: row.skills,
    message: row.message, availableHours: row.available_hours,
    status: row.status, createdAt: row.created_at,
  };
}

const Volunteer = {
  async findAll() {
    const res = await db.query('SELECT * FROM volunteers ORDER BY created_at DESC');
    return res.rows.map(rowToVolunteer);
  },
  async findById(id) {
    const res = await db.query('SELECT * FROM volunteers WHERE id=$1', [id]);
    return rowToVolunteer(res.rows[0]);
  },
  async findByInterest(interest) {
    const all = await this.findAll();
    return all.filter(v => v.interests.includes(interest));
  },
  async create({ name, email, phone='', interests=[], skills='', message='', availableHours='' }) {
    const check = await db.query('SELECT id FROM volunteers WHERE email=$1', [email]);
    if (check.rows.length > 0) return { error: 'Email already registered.' };
    const id  = uuidv4();
    const now = new Date().toISOString();
    await db.query(
      "INSERT INTO volunteers (id,name,email,phone,interests,skills,message,available_hours,status,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending',$9)",
      [id, name, email, phone, JSON.stringify(interests), skills, message, availableHours, now]
    );
    return this.findById(id);
  },
  async updateStatus(id, status) {
    await db.query('UPDATE volunteers SET status=$1 WHERE id=$2', [status, id]);
    return this.findById(id);
  },
};

module.exports = Volunteer;
