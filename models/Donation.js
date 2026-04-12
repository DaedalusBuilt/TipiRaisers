/**
 * Donation.js — Donation record model (JSON-based)
 * 
 * TODO: Replace with a real DB model once you integrate
 *       a payment processor (Stripe / PayPal).
 * TODO: Add proper PCI compliance handling — never store
 *       raw card data. Only store metadata & transaction IDs.
 */

const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../config/database');

const FILE = 'donations.json';

const Donation = {
  findAll() {
    return readJSON(FILE).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getTotalRaised() {
    return readJSON(FILE)
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0);
  },

  create({ donorName, donorEmail, amount, message, paymentMethod, transactionId }) {
    const donations = readJSON(FILE);
    const donation = {
      id: uuidv4(),
      donorName,
      donorEmail,
      amount: parseFloat(amount),
      message: message || '',
      paymentMethod: paymentMethod || 'pending',
      transactionId: transactionId || null, // TODO: Fill from Stripe/PayPal response
      status: 'pending', // TODO: Update to 'completed' on payment confirmation webhook
      createdAt: new Date().toISOString(),
    };
    donations.push(donation);
    writeJSON(FILE, donations);
    return donation;
  },

  updateStatus(id, status, transactionId = null) {
    const donations = readJSON(FILE);
    const index = donations.findIndex(d => d.id === id);
    if (index === -1) return null;
    donations[index].status = status;
    if (transactionId) donations[index].transactionId = transactionId;
    writeJSON(FILE, donations);
    return donations[index];
  },
};

module.exports = Donation;
