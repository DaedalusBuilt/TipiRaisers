/**
 * routes/involve.js — Get Involved page and volunteer sign-up
 */

const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// ── Get Involved Page ────────────────────────────────────
router.get('/', (req, res) => {
  res.render('get-involved', { title: 'Get Involved', flash: req.flash() });
});

// ── Volunteer Sign-Up ────────────────────────────────────
router.post('/volunteer', (req, res) => {
  const { name, email, phone, skills, message, availableHours } = req.body;
  const interests = Array.isArray(req.body.interests)
    ? req.body.interests
    : req.body.interests ? [req.body.interests] : [];

  if (!name || !email) {
    req.flash('error', 'Name and email are required.');
    return res.redirect('/get-involved');
  }

  const result = Volunteer.create({ name, email, phone, interests, skills, message, availableHours });

  if (result.error) {
    req.flash('error', result.error);
    return res.redirect('/get-involved');
  }

  // TODO: Send a confirmation email to the volunteer here using Nodemailer
  // TODO: Notify admin of new volunteer sign-up via email

  req.flash('success', `Thank you, ${name}! We'll be in touch soon.`);
  res.redirect('/get-involved');
});

// ── Newsletter Sign-Up (AJAX endpoint) ──────────────────
router.post('/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required.' });

  // TODO: Integrate with Mailchimp / ConvertKit / SendGrid audience list
  // For now, save as a volunteer with newsletter interest only
  Volunteer.create({ name: 'Newsletter', email, interests: ['newsletter'] });

  res.json({ success: true, message: 'You\'ve been added to our newsletter!' });
});

module.exports = router;
