const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// GET    /api/projects          (public)
router.get('/', projectController.getAll);

// POST   /api/projects          (admin only)
router.post('/', authenticateAdmin, projectController.create);

// PUT    /api/projects/:id      (admin only)
router.put('/:id', authenticateAdmin, projectController.update);

// DELETE /api/projects/:id      (admin only)
router.delete('/:id', authenticateAdmin, projectController.remove);

module.exports = router;
