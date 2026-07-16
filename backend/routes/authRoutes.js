const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/verify
router.get('/verify', authenticateAdmin, authController.verify);

module.exports = router;
