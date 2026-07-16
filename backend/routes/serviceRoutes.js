const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// GET    /api/services          (public)
router.get('/', serviceController.getAll);

// POST   /api/services          (admin only)
router.post('/', authenticateAdmin, serviceController.create);

// PUT    /api/services/:id      (admin only)
router.put('/:id', authenticateAdmin, serviceController.update);

// DELETE /api/services/:id      (admin only)
router.delete('/:id', authenticateAdmin, serviceController.remove);

module.exports = router;
