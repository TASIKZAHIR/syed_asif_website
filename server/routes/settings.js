const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');

// Default initial settings
const defaultSettings = {
  name: 'Asif Raza',
  roleTitle: 'Video Editor & Colorist',
  experienceYears: '2+',
  experienceLabel: 'Years Experience',
  projectsDone: '50+',
  projectsLabel: 'Projects Done',
  happyClients: '20+',
  clientsLabel: 'Happy Clients',
  portraitUrl: 'assets/portrait.png',
  cvUrl: 'assets/resume.pdf',
  bioHeading: 'Transforming Raw Footage Into High-Retention Visual Masterpieces',
  bioText: 'I am Asif Raza, a dedicated Video Editor & Colorist specializing in high-impact short-form storytelling (Reels, TikTok, Shorts), polished YouTube long-form content, and cinematic color grading. Using industry-standard DaVinci Resolve Studio and Premiere Pro, I craft immersive visual narratives that captivate viewers, preserve emotional tone, and drive millions of views.',
  email: 'asif.raza.editor@gmail.com',
  phone: '+1 (555) 019-2834',
  location: 'Worldwide / Remote Available',
  socialLinks: {
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
    behance: 'https://behance.net',
  },
};

// @route   GET /api/settings
// @desc    Get site settings & hero stats
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(defaultSettings);
    }
    return res.json({ success: true, data: settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    // Return fallback settings if DB error so front-end never breaks
    return res.json({ success: true, data: defaultSettings, fallback: true });
  }
});

// @route   PUT /api/settings
// @desc    Update site settings & hero stats
// @access  Private (Admin)
router.put('/', auth, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    const updated = await settings.save();
    return res.json({
      success: true,
      message: 'Site settings updated successfully',
      data: updated,
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to update settings' });
  }
});

module.exports = router;

