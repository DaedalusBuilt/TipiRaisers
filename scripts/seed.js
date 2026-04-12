/**
 * scripts/seed.js — Seed the database with starter blog posts
 * 
 * Run with: npm run seed
 * 
 * This will OVERWRITE existing posts.json with fresh seed data.
 * TODO: Add a --merge flag to append rather than replace.
 */

const fs   = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

const POSTS_FILE = path.join(__dirname, '..', 'data', 'posts.json');

const seedPosts = [
  {
    title: 'Launching the Reservation Homes Project',
    category: 'Progress Update',
    excerpt: 'It\'s no secret that reservation communities are in deep need of quality, affordable homes. We are proud to announce the launch of the Reservation Homes Project.',
    content: `# We Are Building More Than Homes\n\nIt's no secret that reservation communities are in deep need of quality, affordable homes. For too long, our families have lived in substandard housing — overcrowded, underfunded, and overlooked.\n\nWith years of home construction efforts under our belts, we are proud to announce the official launch of the **Reservation Homes Project**.\n\n## What This Means for Our Community\n\nThis initiative will provide much needed housing for tribal members, offer sustainable income for Indigenous employees, and create lasting value for stakeholders.\n\nBy 2035, we envision a reservation where tribal employees thrive as highly-trained construction industry experts, Native families enjoy affordable, high-quality homes, and the next generation of construction professionals nurtures and hones their skills right here.\n\n*Together, we raise more than tipis — we raise futures.*`,
    author: 'Tipi Raisers Team',
    status: 'published',
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    title: 'Community Survey Results: Understanding Our Housing Needs',
    category: 'Progress Update',
    excerpt: 'Over 200 tribal households spoke — and we listened. Here\'s what our community housing survey revealed.',
    content: `# What Our Community Told Us\n\nBefore breaking ground, we needed to listen. In early 2024, our team conducted a comprehensive housing needs survey reaching over 200 tribal households.\n\n## Key Findings\n\n- **67%** reported living in overcrowded conditions\n- **42%** reported significant structural issues in their current homes\n- **89%** expressed strong support for the Reservation Homes Project\n- **73%** said they or a family member would be interested in construction training\n\nThank you to everyone who participated. Your voices are the foundation of this project.`,
    author: 'Tipi Raisers Team',
    status: 'published',
    createdAt: '2024-03-20T12:00:00.000Z',
  },
  {
    title: 'How You Can Get Involved Right Now',
    category: 'How to Help',
    excerpt: 'From skilled trades to grant writing, there are many ways to support the Reservation Homes Project.',
    content: `# There Are Many Ways to Help\n\nBuilding a better future for reservation families takes a whole community. Whether you're a skilled tradesperson, a passionate advocate, or someone who simply wants to contribute — there is a place for you.\n\n## Volunteer Your Skills\n\n- **Construction & Trades** — carpenters, electricians, plumbers, laborers\n- **Project Management** — help coordinate build schedules and resources\n- **Education & Training** — teach or assist in our construction apprenticeship\n- **Marketing & Communications** — help spread the word\n- **Grant Writing** — help us secure funding\n\n[Visit our Get Involved page](/get-involved) to sign up today.`,
    author: 'Tipi Raisers Team',
    status: 'published',
    createdAt: '2024-04-01T09:00:00.000Z',
  },
];

const posts = seedPosts.map(p => ({
  id: uuidv4(),
  slug: slugify(p.title, { lower: true, strict: true }),
  imageUrl: '',
  updatedAt: p.createdAt,
  ...p,
}));

fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
console.log(`✅ Seeded ${posts.length} posts to ${POSTS_FILE}`);
