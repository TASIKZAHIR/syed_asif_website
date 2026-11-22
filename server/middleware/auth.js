const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No authorization header, access denied' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'asif_raza_jwt_secret_key_2026_portfolio_secure');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is not valid or has expired' });
  }
};

