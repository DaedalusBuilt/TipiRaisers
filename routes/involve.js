const express   = require('express');
const router    = express.Router();
const Volunteer = require('../models/Volunteer');

router.get('/', (req, res) => {
  res.render('get-involved', { title: 'Get Involved', flash: req.flash() });
});

router.post('/volunteer', async (req, res) => {
  const { name, email, phone, skills, message, availableHours } = req.body;
  const interests = Array.isArray(req.body.interests) ? req.body.interests : req.body.interests ? [req.body.interests] : [];
  if (!name || !email) { req.flash('error', 'Name and email are required.'); return res.redirect('/get-involved'); }
  try {
    const result = await Volunteer.create({ name, email, phone, interests, skills, message, availableHours });
    if (result && result.error) { req.flash('error', result.error); return res.redirect('/get-involved'); }
    req.flash('success', `Thank you, ${name}! We'll be in touch soon.`);
    res.redirect('/get-involved');
  } catch (e) {
    console.error('Volunteer error:', e);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/get-involved');
  }
});

router.post('/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required.' });
  try { await Volunteer.create({ name: 'Newsletter', email, interests: ['newsletter'] }); } catch (e) {}
  res.json({ success: true, message: "You've been added to our newsletter!" });
});

module.exports = router;
