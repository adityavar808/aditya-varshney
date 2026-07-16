const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// GET    /api/skills          (public)
router.get('/', skillController.getAll);

// POST   /api/skills          (admin only)
router.post('/', authenticateAdmin, skillController.create);

// PUT    /api/skills/:id      (admin only)
router.put('/:id', authenticateAdmin, skillController.update);

// DELETE /api/skills/:id      (admin only)
router.delete('/:id', authenticateAdmin, skillController.remove);

module.exports = router;
