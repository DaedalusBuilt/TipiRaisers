const express  = require('express');
const router   = express.Router();
const Donation = require('../models/Donation');

router.get('/', async (req, res) => {
  let totalRaised = 0;
  try { totalRaised = await Donation.getTotalRaised(); } catch (e) {}
  const goalAmount      = 250000;
  const progressPercent = Math.min(Math.round((totalRaised / goalAmount) * 100), 100);
  res.render('donate', { title: 'Donate', totalRaised, goalAmount, progressPercent, flash: req.flash() });
});

router.post('/', async (req, res) => {
  const { donorName, donorEmail, amount, message } = req.body;
  if (!donorName || !donorEmail || !amount) {
    req.flash('error', 'Please fill in all required fields.');
    return res.redirect('/donate');
  }
  try {
    await Donation.create({ donorName, donorEmail, amount: parseFloat(amount), message, paymentMethod: 'pending', transactionId: null });
    req.flash('success', `Thank you, ${donorName}! Your generous donation is being processed.`);
    res.redirect('/donate/thank-you');
  } catch (e) {
    console.error('Donation error:', e);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/donate');
  }
});

router.get('/thank-you', (req, res) => {
  res.render('donate-thanks', { title: 'Thank You!', flash: req.flash() });
});

module.exports = router;
