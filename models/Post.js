/**
 * Post.js — Blog post model (JSON-based)
 * 
 * TODO: Migrate to a real DB schema (Mongoose/Sequelize/Prisma)
 *       when you're ready to scale beyond flat-file storage.
 */

const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const { readJSON, writeJSON } = require('../config/database');

const FILE = 'posts.json';

const Post = {
  // Get all posts, newest first
  findAll() {
    return readJSON(FILE).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get only published posts
  findPublished() {
    return this.findAll().filter(p => p.status === 'published');
  },

  // Find post by slug
  findBySlug(slug) {
    return readJSON(FILE).find(p => p.slug === slug) || null;
  },

  // Find post by ID
  findById(id) {
    return readJSON(FILE).find(p => p.id === id) || null;
  },

  // Get posts by category
  findByCategory(category) {
    return this.findPublished().filter(p => p.category === category);
  },

  // Create new post
  create({ title, content, excerpt, category, author, imageUrl, status = 'draft' }) {
    const posts = readJSON(FILE);
    const slug = slugify(title, { lower: true, strict: true });
    const post = {
      id: uuidv4(),
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      category,
      author,
      imageUrl: imageUrl || '', // TODO: Add image upload path here
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(post);
    writeJSON(FILE, posts);
    return post;
  },

  // Update post
  update(id, updates) {
    const posts = readJSON(FILE);
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return null;
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }
    posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString() };
    writeJSON(FILE, posts);
    return posts[index];
  },

  // Delete post
  delete(id) {
    const posts = readJSON(FILE);
    const filtered = posts.filter(p => p.id !== id);
    writeJSON(FILE, filtered);
    return filtered.length < posts.length;
  },

  // Get recent posts
  findRecent(limit = 3) {
    return this.findPublished().slice(0, limit);
  },
};

module.exports = Post;
