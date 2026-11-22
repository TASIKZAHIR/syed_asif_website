require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const { sampleSettings, sampleProjects, sampleColorGrades, sampleInquiries } = require('./seed');
const Project = require('./models/Project');
const ColorGrade = require('./models/ColorGrade');
const SiteSettings = require('./models/SiteSettings');
const Inquiry = require('./models/Inquiry');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const colorGradeRoutes = require('./routes/colorGrades');
const inquiryRoutes = require('./routes/inquiries');
const settingsRoutes = require('./routes/settings');
const healthRoutes = require('./routes/health');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Configuration
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      if (
        allowedOrigins.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.netlify.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-Memory Fallback State (Provides 100% full CRUD functionality if Mongo Atlas is not yet connected locally)
let isMongoConnected = false;
let memSettings = { ...sampleSettings };
let memProjects = sampleProjects.map((p, i) => ({ ...p, _id: `mem_proj_${i + 1}`, createdAt: new Date() }));
let memColorGrades = sampleColorGrades.map((c, i) => ({ ...c, _id: `mem_cg_${i + 1}`, createdAt: new Date() }));
let memInquiries = sampleInquiries.map((inq, i) => ({ ...inq, _id: `mem_inq_${i + 1}`, createdAt: new Date() }));

// Fallback Middleware Interceptor: Active ONLY when MongoDB is offline
app.use((req, res, next) => {
  if (isMongoConnected) return next();

  // Settings
  if (req.path === '/api/settings') {
    if (req.method === 'GET') {
      return res.json({ success: true, data: memSettings, fallbackMode: true });
    }
    if (req.method === 'PUT') {
      return authMiddleware(req, res, () => {
        Object.assign(memSettings, req.body);
        return res.json({ success: true, message: 'Settings updated (local mode)', data: memSettings, fallbackMode: true });
      });
    }
  }

  // Projects
  if (req.path === '/api/projects' || req.path.startsWith('/api/projects/')) {
    const segments = req.path.split('/');
    const projId = segments[3];

    if (req.method === 'GET') {
      if (projId) {
        const proj = memProjects.find((p) => p._id === projId);
        return proj ? res.json({ success: true, data: proj }) : res.status(404).json({ success: false, message: 'Not found' });
      }
      const category = req.query.category;
      let results = [...memProjects];
      if (category && category !== 'all') {
        results = results.filter((p) => p.category === category);
      }
      return res.json({ success: true, count: results.length, data: results, fallbackMode: true });
    }

    if (req.method === 'POST') {
      return authMiddleware(req, res, () => {
        const { title, category, categoryLabel, videoUrl, thumbnailUrl, client, metrics, description, softwareUsed } = req.body;
        if (!title || !videoUrl || !thumbnailUrl) {
          return res.status(400).json({ success: false, message: 'Title, video URL, and thumbnail URL are required' });
        }
        const newProj = {
          _id: `mem_proj_${Date.now()}`,
          title,
          category: category || 'commercial',
          categoryLabel: categoryLabel || 'Commercial / YouTube',
          videoUrl,
          thumbnailUrl,
          client: client || 'Client Work',
          metrics: metrics || '1.2M+ Views',
          description: description || '',
          softwareUsed: Array.isArray(softwareUsed) ? softwareUsed : (softwareUsed || '').split(',').map(s => s.trim()).filter(Boolean),
          createdAt: new Date(),
        };
        memProjects.unshift(newProj);
        return res.status(201).json({ success: true, data: newProj, fallbackMode: true });
      });
    }

    if (req.method === 'PUT') {
      return authMiddleware(req, res, () => {
        const idx = memProjects.findIndex((p) => p._id === projId);
        if (idx === -1) return res.status(404).json({ success: false, message: 'Project not found' });
        memProjects[idx] = { ...memProjects[idx], ...req.body };
        return res.json({ success: true, data: memProjects[idx], fallbackMode: true });
      });
    }

    if (req.method === 'DELETE') {
      return authMiddleware(req, res, () => {
        memProjects = memProjects.filter((p) => p._id !== projId);
        return res.json({ success: true, message: 'Project deleted (local mode)', fallbackMode: true });
      });
    }
  }

  // Color Grades
  if (req.path === '/api/color-grades' || req.path.startsWith('/api/color-grades/')) {
    const cgId = req.path.split('/')[3];

    if (req.method === 'GET') {
      return res.json({ success: true, count: memColorGrades.length, data: memColorGrades, fallbackMode: true });
    }
    if (req.method === 'POST') {
      return authMiddleware(req, res, () => {
        const newCg = {
          _id: `mem_cg_${Date.now()}`,
          ...req.body,
          createdAt: new Date(),
        };
        memColorGrades.unshift(newCg);
        return res.status(201).json({ success: true, data: newCg, fallbackMode: true });
      });
    }
    if (req.method === 'PUT') {
      return authMiddleware(req, res, () => {
        const idx = memColorGrades.findIndex((c) => c._id === cgId);
        if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
        memColorGrades[idx] = { ...memColorGrades[idx], ...req.body };
        return res.json({ success: true, data: memColorGrades[idx], fallbackMode: true });
      });
    }
    if (req.method === 'DELETE') {
      return authMiddleware(req, res, () => {
        memColorGrades = memColorGrades.filter((c) => c._id !== cgId);
        return res.json({ success: true, message: 'Deleted', fallbackMode: true });
      });
    }
  }

  // Inquiries
  if (req.path === '/api/inquiries' || req.path.startsWith('/api/inquiries/')) {
    const inqId = req.path.split('/')[3];

    if (req.method === 'GET') {
      return authMiddleware(req, res, () => {
        return res.json({ success: true, count: memInquiries.length, data: memInquiries, fallbackMode: true });
      });
    }
    if (req.method === 'POST') {
      const { name, email, projectType, budget, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
      }
      const newInquiry = {
        _id: `mem_inq_${Date.now()}`,
        name,
        email,
        projectType: projectType || 'Video Editing',
        budget: budget || '$500 - $1,500',
        message,
        status: 'new',
        createdAt: new Date(),
      };
      memInquiries.unshift(newInquiry);
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully. Asif will get back to you shortly.',
        data: newInquiry,
        fallbackMode: true,
      });
    }
    if (req.method === 'PATCH') {
      return authMiddleware(req, res, () => {
        const { status } = req.body;
        const item = memInquiries.find((inq) => inq._id === inqId);
        if (item) item.status = status;
        return res.json({ success: true, data: item, fallbackMode: true });
      });
    }
    if (req.method === 'DELETE') {
      return authMiddleware(req, res, () => {
        memInquiries = memInquiries.filter((inq) => inq._id !== inqId);
        return res.json({ success: true, message: 'Inquiry removed', fallbackMode: true });
      });
    }
  }

  next();
});

// Mount Main API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/color-grades', colorGradeRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingsRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    name: 'Asif Raza — Video Editor & Colorist Portfolio API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      projects: 'GET /api/projects',
      colorGrades: 'GET /api/color-grades',
      settings: 'GET /api/settings',
      inquiries: 'POST /api/inquiries',
      login: 'POST /api/auth/login',
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred',
  });
});

// Auto-seed database when empty on live MongoDB
async function autoSeedIfEmpty() {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Auto-seeding initial data...');
      await SiteSettings.create(sampleSettings);
      await Project.insertMany(sampleProjects);
      await ColorGrade.insertMany(sampleColorGrades);
      await Inquiry.insertMany(sampleInquiries);
      console.log('Initial portfolio data seeded successfully!');
    }
  } catch (err) {
    console.error('Auto-seed check warning:', err.message);
  }
}

// Connect to MongoDB Atlas / Local
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/asif_portfolio';

console.log(`Connecting to MongoDB...`);
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 2000,
  })
  .then(async () => {
    isMongoConnected = true;
    console.log('🚀 Connected to MongoDB successfully!');
    await autoSeedIfEmpty();
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn('\n⚠️ MongoDB Notice:');
    console.warn('Running with In-Memory Mock Controller. All CRUD operations for Projects, Color Grades, Inquiries, and Hero Settings are enabled!');
    console.warn('👉 To connect MongoDB Atlas in production: set MONGO_URI in your environment variables.\n');
  });

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🎬 Asif Raza Portfolio API running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
