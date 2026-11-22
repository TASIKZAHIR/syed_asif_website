/* ==========================================================================
   Configuration file for Asif Raza Portfolio Frontend
   ========================================================================== */

const CONFIG = {
  // In development, points to the local Express server on port 5000.
  // In production, when deploying on Netlify, update this URL to your Render API URL:
  // e.g., 'https://asif-raza-portfolio-api.onrender.com'
  API_BASE_URL:
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
      ? 'http://localhost:5000'
      : 'https://asif-raza-portfolio-api.onrender.com', // Replace with your live Render backend URL
};

// Export for module or global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

