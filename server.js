/**
 * server.js — Tipi Raisers Web App Entry Point
 * 
 * TODO: Add rate limiting (express-rate-limit) before deploying
 * TODO: Add helmet.js for HTTP security headers
 * TODO: Add compression middleware for production
 * TODO: Configure HTTPS / SSL in production (use Nginx + Let's Encrypt)
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Trust proxy (required for localtunnel / ngrok / Render / Railway) ──
app.set('trust proxy', 1);

// ── View Engine ──────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static Files ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Body Parsing ─────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// ── Session & Flash ──────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'tipi-raisers-secret-change-me',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false, // keep false so it works over localtunnel/ngrok (HTTP tunnels)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
}));
app.use(flash());

// ── Global Template Variables ────────────────────────────
app.use((req, res, next) => {
  res.locals.siteName = process.env.SITE_NAME || 'Tipi Raisers';
  res.locals.siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  res.locals.isAdmin = req.session && req.session.isAdmin;
  res.locals.currentPath = req.path;
  next();
});

// ── Routes ───────────────────────────────────────────────
app.use('/', require('./routes/index'));
app.use('/blog', require('./routes/blog'));
app.use('/donate', require('./routes/donate'));
app.use('/get-involved', require('./routes/involve'));
app.use('/admin', require('./routes/admin'));

// ── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// ── Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Server Error', error: err.message });
});

// ── Start Server ─────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const nets = os.networkInterfaces();
  let localIP = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) { localIP = net.address; break; }
    }
  }
  console.log(`\n🏠 Tipi Raisers is running!`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${localIP}:${PORT}`);
  console.log(`   Admin:   http://${localIP}:${PORT}/admin\n`);
});

module.exports = app;
