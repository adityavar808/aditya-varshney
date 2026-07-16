const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aditya_default_sec_1100';

// POST /api/auth/login
const login = (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === configuredPassword) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ error: 'Incorrect password' });
  }
};

// GET /api/auth/verify
const verify = (req, res) => {
  res.json({ valid: true });
};

module.exports = { login, verify };
