# 🏠 Tipi Raisers — Reservation Homes Project Website

A blog-style community website for the **Tipi Raisers Reservation Homes Project** — keeping the community informed on progress, how to get involved, and how to donate.

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/TipiRaisersWeb.git
cd TipiRaisersWeb

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see Configuration section below)

# 4. Start the development server
npm run dev

# 5. Open in browser
# http://localhost:3000
# Admin: http://localhost:3000/admin/login
```

---

## 📁 Project Structure

```
TipiRaisersWeb/
├── server.js               # Express app entry point
├── package.json
├── .env.example            # Environment variable template
├── config/
│   └── database.js         # JSON flat-file data layer
├── routes/
│   ├── index.js            # Home, About, Progress pages
│   ├── blog.js             # Blog listing + single post
│   ├── donate.js           # Donation form + processing
│   ├── involve.js          # Volunteer sign-up + newsletter
│   └── admin.js            # Admin dashboard (protected)
├── models/
│   ├── Post.js             # Blog post CRUD
│   ├── Donation.js         # Donation records
│   └── Volunteer.js        # Volunteer sign-up records
├── middleware/
│   └── auth.js             # Admin session authentication
├── views/                  # EJS templates
│   ├── partials/           # head, nav, footer
│   ├── admin/              # Admin panel views
│   ├── index.ejs           # Home page
│   ├── blog.ejs            # Blog listing
│   ├── post.ejs            # Single blog post
│   ├── about.ejs
│   ├── get-involved.ejs
│   ├── donate.ejs
│   ├── donate-thanks.ejs
│   ├── progress.ejs        # Project milestone tracker
│   ├── 404.ejs
│   └── 500.ejs
├── public/
│   ├── css/style.css       # Full stylesheet (earth tone theme)
│   ├── js/main.js          # Frontend interactivity
│   └── images/             # TODO: Add your images here
└── data/
    ├── posts.json          # Blog posts (committed to repo)
    ├── donations.json      # Donation records (gitignored)
    └── volunteers.json     # Volunteer records (gitignored)
```

---

## ⚙️ Configuration

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description |
|---|---|
| `PORT` | Server port (default 3000) |
| `SESSION_SECRET` | Strong random string for sessions |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key (TODO) |
| `STRIPE_SECRET_KEY` | Stripe secret key (TODO) |

---

## ✅ TODO Checklist (Before Launch)

### Payments
- [ ] Integrate Stripe or PayPal in `routes/donate.js`
- [ ] Add Stripe webhook endpoint for payment confirmation
- [ ] Update donation status from `pending` → `completed` on webhook

### Content
- [ ] Replace placeholder team members in `views/about.ejs`
- [ ] Add real hero background image at `public/images/hero-bg.jpg`
- [ ] Add partner logos to `public/images/partners/`
- [ ] Add real social media URLs in `views/partials/footer.ejs`
- [ ] Update impact dollar amounts in `views/donate.ejs`
- [ ] Update stat numbers in `views/index.ejs` to match real targets
- [ ] Add real contact info (email, phone, address) in `views/about.ejs`
- [ ] Replace TODO gallery placeholders in `views/progress.ejs`

### Tech / Infrastructure
- [ ] Replace flat-file JSON data store with MongoDB or PostgreSQL
- [ ] Add proper admin authentication (Passport.js or Auth0)
- [ ] Enable file upload for post images (multer config)
- [ ] Add rate limiting (`express-rate-limit`) to all POST routes
- [ ] Add `helmet.js` for HTTP security headers
- [ ] Configure HTTPS/SSL (Nginx + Let's Encrypt on production)
- [ ] Set up email notifications (Nodemailer/SendGrid) for volunteer sign-ups
- [ ] Integrate Mailchimp/ConvertKit for newsletter list management
- [ ] Add `robots.txt` and sitemap.xml for SEO
- [ ] Add Google Analytics or Plausible (privacy-friendly)
- [ ] Create 501(c)(3) nonprofit status and add EIN to donate page

### SEO / Meta
- [ ] Add real `og:image` at `public/images/og-cover.jpg`
- [ ] Add real favicon files to `public/images/`
- [ ] Update meta description in `views/partials/head.ejs`

---

## 🛠️ Development

```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm start        # Production start
```

## 🔐 Admin Panel

Visit `/admin/login` and use the credentials from your `.env` file.  
Default (change immediately): `admin` / `changeme123`

## 📦 Tech Stack

- **Backend:** Node.js + Express.js
- **Templating:** EJS
- **Data Store:** JSON flat files (migrate to DB for production)
- **Styling:** Custom CSS (no framework — clean and fast)
- **Fonts:** Playfair Display + Inter (Google Fonts)

---

## 🤝 Contributing

This project is community-driven. Pull requests welcome!

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT © Tipi Raisers

---

*Together, we raise more than tipis — we raise futures.*
