/**
 * routes/blog.js — Blog listing and post detail routes
 */

const express = require('express');
const router = express.Router();
const { marked } = require('marked');
const Post = require('../models/Post');

// ── Blog Index ───────────────────────────────────────────
router.get('/', (req, res) => {
  const { category, page = 1 } = req.query;
  const POSTS_PER_PAGE = 6;
  let posts = Post.findPublished();

  if (category) {
    posts = posts.filter(p => p.category === category);
  }

  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const offset = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(offset, offset + POSTS_PER_PAGE);

  const categories = ['Progress Update', 'Community Stories', 'How to Help',
                      'News & Events', 'Construction Updates', 'Volunteer Spotlight'];

  res.render('blog', {
    title: 'Blog',
    posts: paginatedPosts,
    categories,
    currentCategory: category || null,
    currentPage: parseInt(page),
    totalPages,
    flash: req.flash(),
  });
});

// ── Single Post ──────────────────────────────────────────
router.get('/:slug', (req, res) => {
  const post = Post.findBySlug(req.params.slug);
  if (!post || post.status !== 'published') {
    return res.status(404).render('404', { title: 'Post Not Found' });
  }
  // Convert markdown content to HTML
  const htmlContent = marked(post.content);
  const relatedPosts = Post.findByCategory(post.category)
    .filter(p => p.id !== post.id)
    .slice(0, 3);

  res.render('post', {
    title: post.title,
    post,
    htmlContent,
    relatedPosts,
    flash: req.flash(),
  });
});

module.exports = router;
