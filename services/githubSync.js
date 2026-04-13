/**
 * services/githubSync.js
 *
 * Pushes the SQLite database to GitHub via the REST API
 * whenever a post is created, updated, or deleted.
 *
 * Required environment variables (.env):
 *   GITHUB_TOKEN  — Personal access token (repo scope)
 *   GITHUB_OWNER  — Your GitHub username e.g. "ashergreer"
 *   GITHUB_REPO   — Repo name e.g. "TipiRaisersWeb"
 *   GITHUB_BRANCH — Branch to push to (default: "main")
 *
 * Create a token at: https://github.com/settings/tokens
 * Required scope: repo (full control)
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const DB_PATH    = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'tipirasers.db');
const DB_GH_PATH = 'data/tipirasers.db';

// Make an authenticated GitHub API request
function githubRequest(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      path:     `/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}${endpoint}`,
      method,
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept':        'application/vnd.github+json',
        'User-Agent':    'TipiRaisers-App',
        'Content-Type':  'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function syncDatabase(commitMessage = 'chore: sync database') {
  // Skip silently if not configured (safe for local dev)
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) return;

  const branch = process.env.GITHUB_BRANCH || 'main';

  try {
    const content = fs.readFileSync(DB_PATH).toString('base64');

    // Get current file SHA (needed to update an existing file)
    let sha;
    const get = await githubRequest('GET', `/contents/${DB_GH_PATH}?ref=${branch}`);
    if (get.status === 200) sha = get.body.sha;

    // Push updated database
    const res = await githubRequest('PUT', `/contents/${DB_GH_PATH}`, {
      message: commitMessage,
      content,
      branch,
      ...(sha ? { sha } : {}),
    });

    if (res.status === 200 || res.status === 201) {
      console.log(`[githubSync] ✅ Database synced to GitHub`);
    } else {
      console.error(`[githubSync] ❌ Unexpected status ${res.status}:`, res.body?.message);
    }
  } catch (err) {
    console.error('[githubSync] ❌ Sync failed:', err.message);
  }
}

module.exports = { syncDatabase };
