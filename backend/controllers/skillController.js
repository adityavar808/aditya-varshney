const SkillModel = require('../models/skillModel');

// GET /api/skills
const getAll = async (req, res) => {
  try {
    const rows = await SkillModel.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/skills
const create = async (req, res) => {
  const { id, name, tagline, glow, border, iconType, iconContent } = req.body;
  if (!id || !name || !tagline || !glow || !border || !iconType || !iconContent) {
    return res.status(400).json({ error: 'All skill fields are required' });
  }
  try {
    await SkillModel.create({ skillId: id, name, tagline, glow, border, iconType, iconContent });
    res.status(201).json({ message: 'Skill added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/skills/:id
const update = async (req, res) => {
  const { name, tagline, glow, border, iconType, iconContent } = req.body;
  const { id } = req.params;
  if (!name || !tagline || !glow || !border || !iconType || !iconContent) {
    return res.status(400).json({ error: 'All skill fields are required' });
  }
  try {
    const result = await SkillModel.update(id, { name, tagline, glow, border, iconType, iconContent });
    if (!result) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/skills/:id
const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await SkillModel.remove(id);
    if (!result) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, create, update, remove };
