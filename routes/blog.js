const express  = require('express');
const router   = express.Router();
const { marked } = require('marked');
const Post     = require('../models/Post');

const CATEGORIES = ['Progress Update','Community Stories','How to Help','News & Events','Construction Updates','Volunteer Spotlight'];
const PER_PAGE   = 6;

router.get('/', async (req, res) => {
  const { category } = req.query;
  const page = parseInt(req.query.page || 1);
  let posts = [];
  try {
    posts = category ? await Post.findByCategory(category) : await Post.findPublished();
    if (!Array.isArray(posts)) posts = [];
  } catch (e) { posts = []; }
  const totalPages     = Math.ceil(posts.length / PER_PAGE) || 1;
  const paginatedPosts = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  res.render('blog', { title: 'Blog', posts: paginatedPosts, categories: CATEGORIES, currentCategory: category || null, currentPage: page, totalPages, flash: req.flash() });
});

router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findBySlug(req.params.slug);
    if (!post || post.status !== 'published') return res.status(404).render('404', { title: 'Post Not Found' });
    const htmlContent  = marked(post.content);
    const relatedPosts = (await Post.findByCategory(post.category)).filter(p => p.id !== post.id).slice(0, 3);
    res.render('post', { title: post.title, post, htmlContent, relatedPosts, flash: req.flash() });
  } catch (e) {
    res.status(500).render('500', { title: 'Server Error', error: e.message });
  }
});

module.exports = router;
