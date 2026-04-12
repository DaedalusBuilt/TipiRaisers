/**
 * auth.js — Admin authentication middleware
 * 
 * TODO: Replace this simple session-based auth with a more
 *       robust solution when you add more admin users:
 *         - JWT tokens
 *         - Passport.js with local strategy
 *         - Auth0 or similar OAuth provider
 */

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  req.flash('error', 'You must be logged in to access the admin area.');
  return res.redirect('/admin/login');
}

function redirectIfAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin');
  }
  return next();
}

module.exports = { requireAdmin, redirectIfAdmin };
