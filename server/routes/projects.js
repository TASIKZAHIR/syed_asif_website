const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects (with optional category filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error('Error fetching projects:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error fetching project' });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      category,
      categoryLabel,
      videoUrl,
      thumbnailUrl,
      client,
      metrics,
      description,
      softwareUsed,
      featured,
      order,
    } = req.body;

    if (!title || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Video URL, and Thumbnail URL',
      });
    }

    const newProject = new Project({
      title,
      category: category || 'commercial',
      categoryLabel: categoryLabel || 'Commercial / YouTube',
      videoUrl,
      thumbnailUrl,
      client: client || 'Client Work',
      metrics: metrics || '1.2M+ Views',
      description: description || '',
      softwareUsed: Array.isArray(softwareUsed)
        ? softwareUsed
        : typeof softwareUsed === 'string'
        ? softwareUsed.split(',').map((s) => s.trim()).filter(Boolean)
        : ['DaVinci Resolve', 'Premiere Pro'],
      featured: Boolean(featured),
      order: Number(order) || 0,
    });

    const savedProject = await newProject.save();
    return res.status(201).json({ success: true, data: savedProject });
  } catch (err) {
    console.error('Error creating project:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to create project' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const updates = { ...req.body };
    if (typeof updates.softwareUsed === 'string') {
      updates.softwareUsed = updates.softwareUsed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json({ success: true, data: project });
  } catch (err) {
    console.error('Error updating project:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to update project' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Project removed successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

module.exports = router;

