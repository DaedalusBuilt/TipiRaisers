/**
 * models/Post.js — Blog post model using PostgreSQL
 */
const { v4: uuidv4 } = require('uuid');
const slugify        = require('slugify');
const db             = require('../config/database');

function rowToPost(row) {
  if (!row) return null;
  return {
    id: row.id, title: row.title, slug: row.slug, content: row.content,
    excerpt: row.excerpt, category: row.category, author: row.author,
    imageUrl:  row.image_url,
    images:    JSON.parse(row.images || '[]'),
    status: row.status, createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

const Post = {
  async findAll() {
    const res = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    return res.rows.map(rowToPost);
  },
  async findPublished() {
    const res = await db.query("SELECT * FROM posts WHERE status='published' ORDER BY created_at DESC");
    return res.rows.map(rowToPost);
  },
  async findBySlug(slug) {
    const res = await db.query('SELECT * FROM posts WHERE slug=$1', [slug]);
    return rowToPost(res.rows[0]);
  },
  async findById(id) {
    const res = await db.query('SELECT * FROM posts WHERE id=$1', [id]);
    return rowToPost(res.rows[0]);
  },
  async findByCategory(category) {
    const res = await db.query("SELECT * FROM posts WHERE category=$1 AND status='published' ORDER BY created_at DESC", [category]);
    return res.rows.map(rowToPost);
  },
  async findRecent(limit = 3) {
    const res = await db.query("SELECT * FROM posts WHERE status='published' ORDER BY created_at DESC LIMIT $1", [limit]);
    return res.rows.map(rowToPost);
  },
  async create({ title, content, excerpt, category, author, imageUrl = '', images = [], status = 'draft' }) {
    const id   = uuidv4();
    const slug = slugify(title, { lower: true, strict: true });
    const now  = new Date().toISOString();
    const exc  = excerpt || content.substring(0, 200) + '...';
    // First image in the array becomes the featured image
    const featuredUrl = imageUrl || (images.length > 0 ? images[0] : '');
    await db.query(
      'INSERT INTO posts (id,title,slug,content,excerpt,category,author,image_url,images,status,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
      [id, title, slug, content, exc, category, author, featuredUrl, JSON.stringify(images), status, now, now]
    );
    return this.findById(id);
  },
  async update(id, { title, content, excerpt, category, imageUrl, images, status }) {
    const current = await this.findById(id);
    if (!current) return null;
    const now     = new Date().toISOString();
    const newSlug = title ? slugify(title, { lower: true, strict: true }) : current.slug;
    const newImages = images !== undefined ? images : current.images;
    const featuredUrl = imageUrl || (newImages.length > 0 ? newImages[0] : current.imageUrl);
    await db.query(
      'UPDATE posts SET title=COALESCE($1,title), slug=$2, content=COALESCE($3,content), excerpt=COALESCE($4,excerpt), category=COALESCE($5,category), image_url=$6, images=$7, status=COALESCE($8,status), updated_at=$9 WHERE id=$10',
      [title, newSlug, content, excerpt, category, featuredUrl, JSON.stringify(newImages), status, now, id]
    );
    return this.findById(id);
  },
  async delete(id) {
    const res = await db.query('DELETE FROM posts WHERE id=$1', [id]);
    return res.rowCount > 0;
  },
};

module.exports = Post;
