# Suresh K — Portfolio Website · Full Stack

> UI/UX Designer & Front-End Developer · Karur, TN

**Stack:** React 18 + Vite · Node.js + Express · MongoDB · Nodemailer · JWT Auth

---

## Project Structure

```
portfolio/
├── frontend/               ← Public portfolio site  (React + Vite)
│   └── src/
│       ├── components/     ← Navbar, Hero, About, Skills, Projects, …
│       ├── data/
│       │   └── portfolio.js   ← ✏️  Edit this file to update your content
│       ├── hooks/          ← useCursor, useParticleCanvas, useScrollReveal
│       └── styles/
│
├── backend/                ← REST API  (Express + MongoDB)
│   ├── routes/             ← contact, projects, admin, adminProjects, adminMessages
│   ├── middleware/auth.js  ← JWT guard
│   ├── models.js           ← Contact, Project, Admin schemas
│   ├── server.js           ← Entry point
│   └── seed-projects.js    ← One-time DB seed script
│
└── admin/                  ← Private dashboard  (React + Vite, port 5174)
    └── src/
        ├── pages/          ← Login, Dashboard, Messages, Projects
        └── components/     ← Layout (sidebar)
```

---

## Quick Start (local dev)

### 1 · Backend

```bash
cd backend
npm install
cp .env.example .env        # fill in all values (see table below)
node server.js              # → http://localhost:5000
```

**Create your admin account (once):**
```bash
curl -X POST http://localhost:5000/api/admin/seed
# Only works when ADMIN_EMAIL + ADMIN_PASSWORD are set in .env
```

**Seed your projects into MongoDB (once):**
```bash
node seed-projects.js
# Safe — skips if projects already exist
```

### 2 · Portfolio site

```bash
cd frontend
npm install
npm run dev                 # → http://localhost:5173
```

### 3 · Admin dashboard

```bash
cd admin
npm install
npm run dev                 # → http://localhost:5174/login
```

---

## Environment Variables  (`backend/.env`)

| Variable         | Description                                                  |
|------------------|--------------------------------------------------------------|
| `MONGODB_URI`    | MongoDB Atlas URI — `mongodb+srv://user:pass@cluster/db`     |
| `EMAIL_USER`     | Gmail address used to send emails                            |
| `EMAIL_PASS`     | **Gmail App Password** (not your real password — see below)  |
| `EMAIL_TO`       | Destination address for contact form submissions             |
| `JWT_SECRET`     | Long random string — e.g. `openssl rand -hex 32`            |
| `ADMIN_EMAIL`    | Admin login email                                            |
| `ADMIN_PASSWORD` | Admin login password (hashed on first use)                   |
| `CLIENT_URL`     | Frontend origin for CORS — `http://localhost:5173` locally   |
| `PORT`           | Server port — default `5000`                                 |

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App passwords → generate one for "Mail". Use that 16-char code as `EMAIL_PASS`.

---

## Updating Content

All portfolio text lives in **one file:**

```
frontend/src/data/portfolio.js
```

| Export          | What it controls                                    |
|-----------------|-----------------------------------------------------|
| `personalInfo`  | Name, bio, location, email, stats, hero card        |
| `skills`        | Three skill tabs + individual skill cards           |
| `projects`      | All project cards (used as fallback if DB is empty) |
| `reviews`       | Testimonial cards                                   |
| `marqueeItems`  | Scrolling ticker text                               |
| `navLinks`      | Navbar links                                        |

**Adding/editing projects via Admin Dashboard** (recommended after deploying):
1. Open `http://localhost:5174` → Login
2. Projects → **+ Add Project**
3. Projects from DB take priority over `portfolio.js` static data

---

## API Reference

| Method   | Endpoint                          | Auth    | Description                  |
|----------|-----------------------------------|---------|------------------------------|
| `POST`   | `/api/contact`                    | —       | Submit contact form          |
| `GET`    | `/api/projects`                   | —       | Fetch visible projects       |
| `GET`    | `/api/health`                     | —       | Server health check          |
| `POST`   | `/api/admin/login`                | —       | Admin login → JWT token      |
| `POST`   | `/api/admin/seed`                 | —       | Create admin user (once)     |
| `GET`    | `/api/admin/messages`             | ✅ JWT  | List contact messages        |
| `PATCH`  | `/api/admin/messages/:id/read`    | ✅ JWT  | Mark message as read         |
| `PATCH`  | `/api/admin/messages/:id/replied` | ✅ JWT  | Mark message as replied      |
| `DELETE` | `/api/admin/messages/:id`         | ✅ JWT  | Delete message               |
| `GET`    | `/api/admin/projects`             | ✅ JWT  | List all projects            |
| `POST`   | `/api/admin/projects`             | ✅ JWT  | Create project               |
| `PUT`    | `/api/admin/projects/:id`         | ✅ JWT  | Update project               |
| `DELETE` | `/api/admin/projects/:id`         | ✅ JWT  | Delete project               |

---

## Deployment

### Frontend → Vercel

```bash
# Push frontend/ to a GitHub repo
# Connect repo in vercel.com → Framework: Vite → Root: frontend/
# No env vars needed (API is proxied via vite config in dev; hits relative /api in prod)
```

### Backend → Railway

```bash
# Push backend/ to a GitHub repo (or monorepo)
# Connect in railway.app → Add all .env variables → Deploy
# Railway uses railway.toml for config
```

### Admin Dashboard → Vercel (separate project)

```bash
# Push admin/ to GitHub
# Connect in vercel.com → Framework: Vite → Root: admin/
# Add env var: VITE_API_URL=https://your-railway-backend-url.railway.app
```

Update `admin/src/api.js` baseURL if hosting separately:
```js
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
```

---

## Your Links

| Platform   | URL |
|------------|-----|
| GitHub     | https://github.com/SureshKumar333-dot |
| Behance    | https://www.behance.net/sureshsarathi |
| Dribbble   | https://dribbble.com/suresh-3 |
| LinkedIn   | https://www.linkedin.com/in/suresh-K333/ |
| Instagram  | https://instagram.com/mr_delta_design |
| Portfolio  | https://sureshkumar333-dot.github.io/Portfolio/ |
