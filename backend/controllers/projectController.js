const ProjectModel = require('../models/projectModel');

// GET /api/projects
const getAll = async (req, res) => {
  try {
    const rows = await ProjectModel.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/projects
const create = async (req, res) => {
  const { id, name, category, liveUrl, imgCol1Top, imgCol1Bottom, imgCol2 } = req.body;
  if (!id || !name || !category || !liveUrl || !imgCol1Top || !imgCol1Bottom || !imgCol2) {
    return res.status(400).json({ error: 'All project fields are required' });
  }
  try {
    await ProjectModel.create({ projectId: id, name, category, liveUrl, imgCol1Top, imgCol1Bottom, imgCol2 });
    res.status(201).json({ message: 'Project added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/projects/:id
const update = async (req, res) => {
  const { name, category, liveUrl, imgCol1Top, imgCol1Bottom, imgCol2 } = req.body;
  const { id } = req.params;
  if (!name || !category || !liveUrl || !imgCol1Top || !imgCol1Bottom || !imgCol2) {
    return res.status(400).json({ error: 'All project fields are required' });
  }
  try {
    const result = await ProjectModel.update(id, { name, category, liveUrl, imgCol1Top, imgCol1Bottom, imgCol2 });
    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/projects/:id
const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ProjectModel.remove(id);
    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, create, update, remove };
