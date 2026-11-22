const express = require('express');
const router = express.Router();
const ColorGrade = require('../models/ColorGrade');
const auth = require('../middleware/auth');

// @route   GET /api/color-grades
// @desc    Get all before/after color grading comparisons
// @access  Public
router.get('/', async (req, res) => {
  try {
    const comparisons = await ColorGrade.find().sort({ order: 1, createdAt: -1 });
    return res.json({ success: true, count: comparisons.length, data: comparisons });
  } catch (err) {
    console.error('Error fetching color grading comparisons:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch color comparisons' });
  }
});

// @route   GET /api/color-grades/:id
// @desc    Get single comparison
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await ColorGrade.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Comparison not found' });
    }
    return res.json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/color-grades
// @desc    Add new comparison
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      category,
      beforeImageUrl,
      afterImageUrl,
      cameraProfile,
      software,
      lookNotes,
      featured,
      order,
    } = req.body;

    if (!title || !beforeImageUrl || !afterImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, Before Image URL, and After Image URL are required',
      });
    }

    const newComparison = new ColorGrade({
      title,
      category: category || 'Cinematic Grade',
      beforeImageUrl,
      afterImageUrl,
      cameraProfile: cameraProfile || 'Sony S-Log3 / S-Gamut3.Cine',
      software: software || 'DaVinci Resolve Studio 19',
      lookNotes: lookNotes || '',
      featured: featured !== undefined ? Boolean(featured) : true,
      order: Number(order) || 0,
    });

    const saved = await newComparison.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('Error creating comparison:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to save comparison' });
  }
});

// @route   PUT /api/color-grades/:id
// @desc    Update comparison
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let item = await ColorGrade.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Comparison not found' });
    }

    item = await ColorGrade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.json({ success: true, data: item });
  } catch (err) {
    console.error('Error updating comparison:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to update comparison' });
  }
});

// @route   DELETE /api/color-grades/:id
// @desc    Delete comparison
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await ColorGrade.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Comparison not found' });
    }

    await ColorGrade.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Color comparison deleted successfully' });
  } catch (err) {
    console.error('Error deleting comparison:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete comparison' });
  }
});

module.exports = router;

