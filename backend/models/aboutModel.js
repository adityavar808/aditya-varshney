const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  bioText: { type: String, required: true }
});

const About = mongoose.model('About', aboutSchema);

// ───── CRUD ─────

const getAbout = () => About.findOne();

const updateAbout = async (bioText) => {
  const doc = await About.findOne();
  if (doc) {
    doc.bioText = bioText;
    return doc.save();
  }
  return About.create({ bioText });
};

module.exports = { About, getAbout, updateAbout };
