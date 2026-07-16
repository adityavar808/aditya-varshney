const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// GET  /api/about       (public)
router.get('/', aboutController.getAbout);

// PUT  /api/about       (admin only)
router.put('/', authenticateAdmin, aboutController.updateAbout);

module.exports = router;
