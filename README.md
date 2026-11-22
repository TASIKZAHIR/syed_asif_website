# Asif Raza — Video Editor & Colorist Portfolio (Full-Stack)

A modern, production-ready full-stack portfolio website built for **Asif Raza** (Video Editor & Colorist), strictly adhering to the dark matte & vibrant orange gradient aesthetic (`#121212`, `#1B1B1B`, `#FD6F00`).

---

## 📸 Key Features & Architecture

- **Visual Design (Exact Figma Match):**
  - **Color Palette:** Matte Black (`#121212`), Charcoal Cards (`#1B1B1B`), Vibrant Orange Gradient (`linear-gradient(90deg, #FD6F00 0%, #E46400 100%)`), Off-white text (`#FAFAFA`), Muted text (`#959595`), Dividers (`#2A2A2A`).
  - **Typography:** Google Fonts **Plus Jakarta Sans** (600, 700, 800) paired with **Inter** (400, 500, 600).
  - **Hero Section (2-Column Split):**
    - Left: `Hi I am` → `Asif Raza` → `Video Editor & Colorist` (oversized orange gradient).
    - 4 circular social icon links with orange glow (Instagram, YouTube, LinkedIn, Behance).
    - Dual CTA: Solid orange `Hire Me` & dark outline `Download CV`.
    - Dynamic 3-metric stats card: `2+ Years Experience`, `50+ Projects Done`, `20+ Happy Clients` (connected to MongoDB API).
    - Right: Dark circular backdrop (`#1A1A1A`) with cutout portrait.
- **Interactive Before & After Color Grading Slider:**
  - Drag vertical orange divider handle to compare flat RAW/LOG camera footage against the final DaVinci Resolve graded look with live camera metadata.
- **Portfolio Video Showcase & Lightbox Modal:**
  - Category filters: `All`, `Reels & Shorts`, `Commercial / YouTube`, `Color Grading`.
  - Click-to-play video lightbox modal (supports YouTube embeds, Vimeo, and direct MP4s).
- **Client Inquiry Form (`POST /api/inquiries`):**
  - Integrated contact form submitting directly to MongoDB with loading spinner and toast notifications.
- **Protected Admin Panel (`/admin.html`):**
  - Authenticated via JWT (`POST /api/auth/login`).
  - Add, edit, and delete video projects.
  - Add, edit, and delete before/after color grading comparisons.
  - Update hero dynamic metrics (experience, projects, clients), portrait URL, CV link, and contact info.
  - Review and manage client project inquiries with status tags and 1-click mailto replies.
- **Clean Split Architecture:**
  - `/client` (Static Frontend — Deployed to Netlify)
  - `/server` (Node.js/Express REST API + MongoDB — Deployed to Render)

---

## 📁 Repository Structure

```text
asif_loru/
├── client/                     # Frontend (Deploy to Netlify)
│   ├── _redirects              # Netlify client-side routing & admin rewrite
│   ├── index.html              # Main public portfolio website
│   ├── admin.html              # Secure admin dashboard
│   ├── css/
│   │   ├── style.css           # Public portfolio styles (Strict Figma match)
│   │   └── admin.css           # Admin control panel styles
│   ├── js/
│   │   ├── config.js           # API base URL configuration
│   │   ├── main.js             # Client-side dynamic data loader & video modal
│   │   ├── slider.js           # Interactive before/after split slider
│   │   └── admin.js            # Admin JWT auth & CRUD operations
│   └── assets/
│       ├── portrait.png        # Asif Raza portrait cutout
│       ├── portrait.svg        # Scalable vector portrait backup
│       └── resume.pdf          # Sample downloadable CV
│
├── server/                     # Backend (Deploy to Render)
│   ├── .env                    # Local environment variables
│   ├── .env.example            # Environment template
│   ├── package.json
│   ├── server.js               # Express server entry point & fallback engine
│   ├── seed.js                 # Database seed script with realistic sample work
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── Project.js          # Portfolio video schema
│   │   ├── ColorGrade.js       # Before/After comparison schema
│   │   ├── Inquiry.js          # Client inquiry schema
│   │   └── SiteSettings.js     # Hero stats & site settings schema
│   └── routes/
│       ├── auth.js             # Admin authentication routes
│       ├── projects.js         # Video projects CRUD
│       ├── colorGrades.js      # Color grade comparisons CRUD
│       ├── inquiries.js        # Client inquiry routes
│       ├── settings.js         # Hero stats & site settings routes
│       └── health.js           # Render uptime health check endpoint
│
└── README.md                   # Full documentation & deployment guide
```

---

## 🚀 Quick Start (Running Locally)

### 1. Start the Backend Server

```bash
cd server
npm install
npm start
```

The server will start on `http://localhost:5000`.
> **Note:** The backend automatically boots an in-memory mock handler if MongoDB Atlas is not yet connected, allowing you to test all endpoints, admin dashboard, and portfolio features immediately out of the box!

### 2. Run the Frontend

Open `client/index.html` directly in your browser, or serve it using any local HTTP server:

```bash
# Using VS Code Live Server extension OR:
cd client
npx serve .
# or python -m http.server 3000
```

- **Live Portfolio:** `http://localhost:3000/index.html` (or `http://localhost:5500/client/`)
- **Admin Dashboard:** `http://localhost:3000/admin.html`
  - **Default Admin Email:** `admin@asifraza.com`
  - **Default Admin Password:** `admin123`

---

## 🍃 Connecting MongoDB Atlas

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user (e.g. `asif_admin`) and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** → **Drivers** (Node.js) and copy your connection string:
   ```text
   mongodb+srv://asif_admin:<password>@cluster0.mongodb.net/asif_portfolio?retryWrites=true&w=majority
   ```
6. Add your connection string to `server/.env`:
   ```env
   MONGO_URI=mongodb+srv://asif_admin:YOUR_PASSWORD@cluster0.mongodb.net/asif_portfolio?retryWrites=true&w=majority
   ```
7. Seed the database with sample projects and color grades:
   ```bash
   cd server
   node seed.js
   ```

---

## 🌐 Production Deployment

### Step 1: Deploy Backend to Render

1. Push your repository to GitHub.
2. Sign in to [Render.com](https://render.com).
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name:** `asif-raza-portfolio-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Add **Environment Variables** in Render dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_secure_random_jwt_secret`
   - `ADMIN_EMAIL`: `admin@asifraza.com`
   - `ADMIN_PASSWORD`: `your_strong_admin_password`
   - `CLIENT_URL`: `https://your-portfolio-site.netlify.app`
7. Click **Create Web Service**. Once deployed, Render provides your live backend URL (e.g., `https://asif-raza-portfolio-api.onrender.com`).
8. Verify server status by visiting `https://asif-raza-portfolio-api.onrender.com/api/health`.

---

### Step 2: Deploy Frontend to Netlify

1. In `client/js/config.js`, update `API_BASE_URL` with your Render backend URL:
   ```javascript
   const CONFIG = {
     API_BASE_URL:
       window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
         ? 'http://localhost:5000'
         : 'https://asif-raza-portfolio-api.onrender.com', // Your Render URL
   };
   ```
2. Sign in to [Netlify.com](https://netlify.com).
3. Click **Add new site** → **Import an existing project**.
4. Connect your repository.
5. Set deployment configuration:
   - **Base directory:** `client`
   - **Publish directory:** `client` (or leave blank if base directory is set)
   - **Build command:** (Leave empty — pure static HTML/CSS/JS)
6. Click **Deploy Site**.
7. Netlify assigns your live domain (e.g. `https://asif-raza-portfolio.netlify.app`).
8. Update `CLIENT_URL` in your Render Web Service settings with this Netlify URL to ensure seamless CORS communication.

---

## 🛠️ API Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/health` | `GET` | Public | Server uptime & database health status |
| `/api/auth/login` | `POST` | Public | Admin login with JWT response |
| `/api/auth/me` | `GET` | Private (Admin) | Validate JWT token & fetch profile |
| `/api/projects` | `GET` | Public | List all video projects (filterable by category) |
| `/api/projects` | `POST` | Private (Admin) | Create a new project |
| `/api/projects/:id` | `PUT` | Private (Admin) | Update an existing project |
| `/api/projects/:id` | `DELETE` | Private (Admin) | Remove a project |
| `/api/color-grades` | `GET` | Public | List before/after color grading comparisons |
| `/api/color-grades` | `POST` | Private (Admin) | Create new before/after comparison |
| `/api/color-grades/:id` | `PUT` | Private (Admin) | Update before/after comparison |
| `/api/color-grades/:id` | `DELETE` | Private (Admin) | Delete before/after comparison |
| `/api/settings` | `GET` | Public | Fetch hero stats, CV link, and contact info |
| `/api/settings` | `PUT` | Private (Admin) | Update hero dynamic metrics & settings |
| `/api/inquiries` | `POST` | Public | Submit client project inquiry |
| `/api/inquiries` | `GET` | Private (Admin) | List all inquiries |
| `/api/inquiries/:id` | `PATCH` | Private (Admin) | Update inquiry status (`new`, `replied`, `archived`) |
| `/api/inquiries/:id` | `DELETE` | Private (Admin) | Delete an inquiry |

---

## 👤 Credits & Author

- **Designed & Developed for:** Asif Raza (Video Editor & Colorist)
- **License:** MIT

#   s y e d _ a s i f _ p o r t f o l i o  
 