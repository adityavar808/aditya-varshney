const AboutModel = require('../models/aboutModel');

// GET /api/about
const getAbout = async (req, res) => {
  try {
    const row = await AboutModel.getAbout();
    res.json(row || { bioText: '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/about
const updateAbout = async (req, res) => {
  const { bioText } = req.body;
  if (!bioText) {
    return res.status(400).json({ error: 'bioText is required' });
  }
  try {
    await AboutModel.updateAbout(bioText);
    res.json({ message: 'Bio text updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAbout, updateAbout };
