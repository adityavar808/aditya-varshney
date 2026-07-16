const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aditya_default_sec_1100';

/**
 * Express middleware – verifies the Bearer JWT token attached to the
 * Authorization header. Attaches `req.admin` on success.
 */
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticateAdmin };
