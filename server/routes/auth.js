const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// @route   POST /api/auth/login
// @desc    Authenticate admin & return JWT
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@asifraza.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const payload = {
      user: {
        email: adminEmail,
        name: 'Asif Raza',
        role: 'admin',
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'asif_raza_jwt_secret_key_2026_portfolio_secure',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: payload.user,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Verify token & get current admin user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user.user || req.user,
    });
  } catch (err) {
    console.error('Auth verification error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

