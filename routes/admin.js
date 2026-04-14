const express   = require('express');
const router    = express.Router();
const multer    = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path      = require('path');
const fs        = require('fs');
const Post      = require('../models/Post');
const Donation  = require('../models/Donation');
const Volunteer = require('../models/Volunteer');
const { requireAdmin, redirectIfAdmin } = require('../middleware/auth');

// ── Cloudinary config ────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer + Cloudinary storage ──────────────────────────
// Falls back to local disk if Cloudinary env vars are not set
let upload;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder:         'tipi-raisers',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, crop: 'limit' }],
    },
  });
  upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
} else {
  // Local fallback for development without Cloudinary
  const uploadDir = path.join(__dirname, '..', 'public', 'images', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const localStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename:    (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file.originalname).toLowerCase()),
  });
  upload = multer({ storage: localStorage, limits: { fileSize: 10 * 1024 * 1024 } });
}

// Helper: get the final image URL from an upload
function getImageUrl(req, fallbackUrl) {
  if (req.file) {
    // Cloudinary gives req.file.path as the URL; local gives a filename
    return req.file.path || '/images/uploads/' + req.file.filename;
  }
  return fallbackUrl || '';
}

// ── Login ────────────────────────────────────────────────
router.get('/login', redirectIfAdmin, (req, res) => {
  res.render('admin/login', { title: 'Admin Login', flash: req.flash() });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === (process.env.ADMIN_USERNAME || 'admin') && password === (process.env.ADMIN_PASSWORD || 'changeme123')) {
    req.session.isAdmin   = true;
    req.session.adminUser = username;
    return req.session.save(err => {
      if (err) { req.flash('error', 'Login failed.'); return res.redirect('/admin/login'); }
      res.redirect('/admin');
    });
  }
  req.flash('error', 'Invalid credentials.');
  res.redirect('/admin/login');
});

router.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });

// ── Dashboard ────────────────────────────────────────────
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [posts, allDonations, allVolunteers, totalRaised] = await Promise.all([
      Post.findAll(), Donation.findAll(), Volunteer.findAll(), Donation.getTotalRaised(),
    ]);
    res.render('admin/dashboard', {
      title: 'Admin Dashboard', posts,
      donations:  allDonations.slice(0, 10),
      volunteers: allVolunteers.slice(0, 10),
      totalRaised, flash: req.flash(),
    });
  } catch (e) {
    console.error('Dashboard error:', e);
    res.render('admin/dashboard', { title: 'Admin Dashboard', posts: [], donations: [], volunteers: [], totalRaised: 0, flash: req.flash() });
  }
});

// ── New Post ─────────────────────────────────────────────
router.get('/posts/new', requireAdmin, (req, res) => {
  res.render('admin/post-form', { title: 'New Post', post: null, flash: req.flash() });
});

router.post('/posts', requireAdmin, upload.single('imageFile'), async (req, res) => {
  const { title, content, excerpt, category, imageUrl, status } = req.body;
  if (!title || !content) { req.flash('error', 'Title and content are required.'); return res.redirect('/admin/posts/new'); }
  const finalImageUrl = getImageUrl(req, imageUrl);
  try {
    await Post.create({ title, content, excerpt, category, author: req.session.adminUser, imageUrl: finalImageUrl, status });
    req.flash('success', `Post "${title}" created successfully.`);
  } catch (e) { console.error('Create error:', e); req.flash('error', 'Failed to create post.'); }
  res.redirect('/admin');
});

// ── Edit Post ────────────────────────────────────────────
router.get('/posts/:id/edit', requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) { req.flash('error', 'Post not found.'); return res.redirect('/admin'); }
    res.render('admin/post-form', { title: 'Edit Post', post, flash: req.flash() });
  } catch (e) { req.flash('error', 'Could not load post.'); res.redirect('/admin'); }
});

router.post('/posts/:id', requireAdmin, upload.single('imageFile'), async (req, res) => {
  const { title, content, excerpt, category, imageUrl, status } = req.body;
  const finalImageUrl = getImageUrl(req, imageUrl);
  try {
    await Post.update(req.params.id, { title, content, excerpt, category, imageUrl: finalImageUrl, status });
    req.flash('success', 'Post updated.');
  } catch (e) { console.error('Update error:', e); req.flash('error', 'Failed to update post.'); }
  res.redirect('/admin');
});

// ── Delete Post ──────────────────────────────────────────
router.post('/posts/:id/delete', requireAdmin, async (req, res) => {
  try { await Post.delete(req.params.id); req.flash('success', 'Post deleted.'); }
  catch (e) { req.flash('error', 'Failed to delete post.'); }
  res.redirect('/admin');
});

module.exports = router;
