const express = require('express');
const router = express.Router();
const adibotController = require('../controllers/adibotController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// GET /api/adibot/context (admin only)
router.get('/context', authenticateAdmin, adibotController.getContext);

// POST /api/adibot/context (admin only)
router.post('/context', authenticateAdmin, adibotController.updateContext);

// POST /api/adibot/chat (public)
router.post('/chat', adibotController.handleChatRequest);

module.exports = router;
