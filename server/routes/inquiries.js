const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const auth = require('../middleware/auth');

// @route   POST /api/inquiries
// @desc    Submit a new contact/hire inquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, projectType, budget, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and project message are required.',
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const inquiry = new Inquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      projectType: projectType || 'Video Editing',
      budget: budget || '$500 - $1,500',
      message: message.trim(),
      status: 'new',
    });

    await inquiry.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. Asif will get back to you shortly.',
      data: inquiry,
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting your inquiry. Please try again.',
    });
  }
});

// @route   GET /api/inquiries
// @desc    Get all client inquiries
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
  }
});

// @route   PATCH /api/inquiries/:id
// @desc    Update inquiry status (new, replied, archived)
// @access  Private (Admin)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    return res.json({ success: true, data: inquiry });
  } catch (err) {
    console.error('Error updating inquiry status:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/inquiries/:id
// @desc    Delete inquiry
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

