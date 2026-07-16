const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  bioText: { type: String, required: true }
});

const About = mongoose.model('About', aboutSchema);

// ───── Seed ─────

const seed = async () => {
  const count = await About.countDocuments();
  if (count === 0) {
    await About.create({
      bioText: "I'm Aditya Varshney, a Computer Science Engineering student passionate about Full Stack Development and AI/ML. I enjoy building intelligent, user-friendly applications using modern web technologies and machine learning. I'm continuously learning, creating real-world projects, and striving to become an AI Engineer who develops impactful solutions."
    });
  }
};

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

module.exports = { About, seed, getAbout, updateAbout };
