const express  = require('express');
const router   = express.Router();
const Post     = require('../models/Post');
const Donation = require('../models/Donation');

router.get('/', async (req, res) => {
  let recentPosts = [];
  let totalRaised = 0;
  try { recentPosts = await Post.findRecent(3); if (!Array.isArray(recentPosts)) recentPosts = []; } catch (e) { recentPosts = []; }
  try { totalRaised = await Donation.getTotalRaised(); } catch (e) { totalRaised = 0; }
  res.render('index', { title: 'Home', recentPosts, totalRaised, flash: req.flash() });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us', flash: req.flash() });
});

router.get('/progress', (req, res) => {
  const milestones = [
    { label: 'Project Launch', date: 'January 2024', completed: true, description: 'Official launch of the Reservation Homes Project initiative.' },
    { label: 'Community Survey', date: 'March 2024', completed: true, description: 'Surveyed 200+ tribal members to assess housing needs.' },
    { label: 'First Build Site Secured', date: 'June 2024', completed: true, description: 'Acquired land and permits for the first two homes.' },
    { label: 'Foundation Crew Training', date: 'September 2024', completed: false, description: 'Train 15 Indigenous workers on foundational construction.' },
    { label: 'First Homes Complete', date: 'December 2025', completed: false, description: 'Complete the first 5 affordable homes on the reservation.' },
    { label: '50 Homes Milestone', date: '2028', completed: false, description: 'Reach 50 completed homes and 40 trained Indigenous tradespeople.' },
    { label: 'Full Reservation Coverage', date: '2035', completed: false, description: 'Every tribal member has access to quality, affordable housing.' },
  ];
  res.render('progress', { title: 'Project Progress', milestones, flash: req.flash() });
});

module.exports = router;
