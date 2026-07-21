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
  const { id, projectId, name, category, liveUrl, images, imgCol1Top, imgCol1Bottom, imgCol2 } = req.body;
  const resolvedId = projectId || id;
  if (!resolvedId || !name || !category || !liveUrl) {
    return res.status(400).json({ error: 'Core project fields (ID, name, category, liveUrl) are required' });
  }

  // Resolve images array
  let finalImages = Array.isArray(images) ? images.filter(Boolean) : [];
  if (finalImages.length === 0) {
    finalImages = [imgCol1Top, imgCol2, imgCol1Bottom].filter(Boolean);
  }

  try {
    await ProjectModel.create({
      projectId: resolvedId,
      name,
      category,
      liveUrl,
      images: finalImages,
      imgCol1Top: finalImages[0] || imgCol1Top || '',
      imgCol2: finalImages[1] || imgCol2 || '',
      imgCol1Bottom: finalImages[2] || imgCol1Bottom || ''
    });
    res.status(201).json({ message: 'Project added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/projects/:id
const update = async (req, res) => {
  const { name, category, liveUrl, images, imgCol1Top, imgCol1Bottom, imgCol2 } = req.body;
  const { id } = req.params;
  if (!name || !category || !liveUrl) {
    return res.status(400).json({ error: 'Core project fields (name, category, liveUrl) are required' });
  }

  let finalImages = Array.isArray(images) ? images.filter(Boolean) : [];
  if (finalImages.length === 0) {
    finalImages = [imgCol1Top, imgCol2, imgCol1Bottom].filter(Boolean);
  }

  try {
    const result = await ProjectModel.update(id, {
      name,
      category,
      liveUrl,
      images: finalImages,
      imgCol1Top: finalImages[0] || imgCol1Top || '',
      imgCol2: finalImages[1] || imgCol2 || '',
      imgCol1Bottom: finalImages[2] || imgCol1Bottom || ''
    });
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
