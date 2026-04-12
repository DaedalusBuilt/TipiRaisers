/**
 * routes/donate.js — Donation page and form submission
 */

const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// ── Donation Page ────────────────────────────────────────
router.get('/', (req, res) => {
  const totalRaised = Donation.getTotalRaised();
  // TODO: Set your actual fundraising goal amount here
  const goalAmount = 250000;
  const progressPercent = Math.min(Math.round((totalRaised / goalAmount) * 100), 100);

  res.render('donate', {
    title: 'Donate',
    totalRaised,
    goalAmount,
    progressPercent,
    flash: req.flash(),
  });
});

// ── Process Donation (form submission) ───────────────────
router.post('/', async (req, res) => {
  const { donorName, donorEmail, amount, message } = req.body;

  if (!donorName || !donorEmail || !amount) {
    req.flash('error', 'Please fill in all required fields.');
    return res.redirect('/donate');
  }

  try {
    // TODO: Integrate Stripe or PayPal here BEFORE creating the record.
    //       Steps:
    //       1. Create a payment intent with Stripe: stripe.paymentIntents.create(...)
    //       2. OR redirect to PayPal checkout URL
    //       3. Handle the webhook callback to confirm payment
    //       4. Only then call Donation.create() with the real transactionId

    // Placeholder — creates a pending donation record
    Donation.create({
      donorName,
      donorEmail,
      amount: parseFloat(amount),
      message,
      paymentMethod: 'pending', // TODO: Replace with 'stripe' or 'paypal'
      transactionId: null,      // TODO: Replace with real transaction ID
    });

    req.flash('success', `Thank you, ${donorName}! Your generous donation is being processed.`);
    res.redirect('/donate/thank-you');
  } catch (err) {
    console.error('Donation error:', err);
    req.flash('error', 'Something went wrong processing your donation. Please try again.');
    res.redirect('/donate');
  }
});

// ── Thank You Page ───────────────────────────────────────
router.get('/thank-you', (req, res) => {
  res.render('donate-thanks', { title: 'Thank You!', flash: req.flash() });
});

// ── TODO: Stripe Webhook Endpoint ────────────────────────
// router.post('/webhook/stripe', express.raw({ type: 'application/json' }), (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   // Verify signature, then update donation status to 'completed'
// });

module.exports = router;
