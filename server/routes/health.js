const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @route   GET /api/health
// @desc    Health check endpoint for Render and uptime monitoring
// @access  Public
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    status: 'ok',
    service: 'Asif Raza Portfolio API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: stateMap[dbState] || 'unknown',
      connected: dbState === 1,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;

