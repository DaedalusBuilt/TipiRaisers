/**
 * Volunteer.js — Volunteer/Involvement sign-up model
 * 
 * TODO: Integrate with email marketing platform 
 *       (Mailchimp, ConvertKit, etc.) to manage contacts.
 * TODO: Send confirmation email on sign-up.
 */

const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../config/database');

const FILE = 'volunteers.json';

const Volunteer = {
  findAll() {
    return readJSON(FILE).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findByInterest(interest) {
    return readJSON(FILE).filter(v => v.interests.includes(interest));
  },

  create({ name, email, phone, interests, skills, message, availableHours }) {
    const volunteers = readJSON(FILE);
    const duplicate = volunteers.find(v => v.email === email);
    if (duplicate) return { error: 'Email already registered' };

    const volunteer = {
      id: uuidv4(),
      name,
      email,
      phone: phone || '',
      interests: interests || [],
      skills: skills || '',
      message: message || '',
      availableHours: availableHours || '',
      status: 'pending', // TODO: Admin reviews and approves volunteers
      createdAt: new Date().toISOString(),
    };
    volunteers.push(volunteer);
    writeJSON(FILE, volunteers);
    return volunteer;
  },

  updateStatus(id, status) {
    const volunteers = readJSON(FILE);
    const index = volunteers.findIndex(v => v.id === id);
    if (index === -1) return null;
    volunteers[index].status = status;
    writeJSON(FILE, volunteers);
    return volunteers[index];
  },
};

module.exports = Volunteer;
