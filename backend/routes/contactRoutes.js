const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// POST   /api/contact          (public – submit form)
router.post('/', contactController.submitContact);

// GET    /api/contact          (admin only – view submissions)
router.get('/', authenticateAdmin, contactController.getAll);

// DELETE /api/contact/:id      (admin only – delete submission)
router.delete('/:id', authenticateAdmin, contactController.remove);

// POST   /api/contact/reply    (admin only – send reply email)
router.post('/reply', authenticateAdmin, contactController.sendReply);

module.exports = router;
