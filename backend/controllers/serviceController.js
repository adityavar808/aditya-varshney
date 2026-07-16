const ServiceModel = require('../models/serviceModel');

// GET /api/services
const getAll = async (req, res) => {
  try {
    const rows = await ServiceModel.getAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/services
const create = async (req, res) => {
  const { id, name, subtitle, description, iconName, iconColor, dotBg } = req.body;
  if (!id || !name || !subtitle || !description || !iconName || !iconColor || !dotBg) {
    return res.status(400).json({ error: 'All service fields are required' });
  }
  try {
    await ServiceModel.create({ serviceId: id, name, subtitle, description, iconName, iconColor, dotBg });
    res.status(201).json({ message: 'Service added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/services/:id
const update = async (req, res) => {
  const { name, subtitle, description, iconName, iconColor, dotBg } = req.body;
  const { id } = req.params;
  if (!name || !subtitle || !description || !iconName || !iconColor || !dotBg) {
    return res.status(400).json({ error: 'All service fields are required' });
  }
  try {
    const result = await ServiceModel.update(id, { name, subtitle, description, iconName, iconColor, dotBg });
    if (!result) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/services/:id
const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ServiceModel.remove(id);
    if (!result) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, create, update, remove };
