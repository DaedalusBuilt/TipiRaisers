/**
 * models/Post.js — Blog post model using PostgreSQL (Supabase / Render)
 */

const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const db = require('../config/database');

// Convert DB row → JS object
function rowToPost(row) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    category: row.category,
    author: row.author,
    imageUrl: row.image_url,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const Post = {
  // ── Get all posts ─────────────────────────────
  async findAll() {
    const res = await db.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    return res.rows.map(rowToPost);
  },

  // ── Published posts only ───────────────────────
  async findPublished() {
    const res = await db.query(
      "SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC"
    );
    return res.rows.map(rowToPost);
  },

  // ── Find by slug ───────────────────────────────
  async findBySlug(slug) {
    const res = await db.query(
      'SELECT * FROM posts WHERE slug = $1',
      [slug]
    );
    return rowToPost(res.rows[0]);
  },

  // ── Find by ID ────────────────────────────────
  async findById(id) {
    const res = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    return rowToPost(res.rows[0]);
  },

  // ── By category ───────────────────────────────
  async findByCategory(category) {
    const res = await db.query(
      "SELECT * FROM posts WHERE category = $1 AND status = 'published' ORDER BY created_at DESC",
      [category]
    );
    return res.rows.map(rowToPost);
  },

  // ── Recent posts ──────────────────────────────
  async findRecent(limit = 3) {
    const res = await db.query(
      "SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
    return res.rows.map(rowToPost);
  },

  // ── Create post ───────────────────────────────
  async create({ title, content, excerpt, category, author, imageUrl = '', status = 'draft' }) {
    const id = uuidv4();
    const slug = slugify(title, { lower: true, strict: true });
    const now = new Date().toISOString();
    const exc = excerpt || content.substring(0, 200) + '...';

    await db.query(
      `INSERT INTO posts
        (id, title, slug, content, excerpt, category, author, image_url, status, created_at, updated_at)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, title, slug, content, exc, category, author, imageUrl, status, now, now]
    );

    return this.findById(id);
  },

  // ── Update post ───────────────────────────────
  async update(id, { title, content, excerpt, category, imageUrl, status }) {
    const current = await this.findById(id);
    if (!current) return null;

    const now = new Date().toISOString();
    const newSlug = title
      ? slugify(title, { lower: true, strict: true })
      : current.slug;

    await db.query(
      `UPDATE posts SET
        title = COALESCE($1, title),
        slug = $2,
        content = COALESCE($3, content),
        excerpt = COALESCE($4, excerpt),
        category = COALESCE($5, category),
        image_url = COALESCE($6, image_url),
        status = COALESCE($7, status),
        updated_at = $8
       WHERE id = $9`,
      [title, newSlug, content, excerpt, category, imageUrl, status, now, id]
    );

    return this.findById(id);
  },

  // ── Delete post ───────────────────────────────
  async delete(id) {
    const res = await db.query(
      'DELETE FROM posts WHERE id = $1',
      [id]
    );

    return res.rowCount > 0;
  },
};

module.exports = Post;
