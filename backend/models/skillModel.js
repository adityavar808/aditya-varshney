const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skillId:     { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  tagline:     { type: String, required: true },
  glow:        { type: String, required: true },
  border:      { type: String, required: true },
  iconType:    { type: String, required: true },  // 'svg' or 'lucide'
  iconContent: { type: String, required: true }   // SVG markup or Lucide icon name
});

const Skill = mongoose.model('Skill', skillSchema);

// ───── CRUD ─────

const getAll = () => Skill.find().sort({ skillId: 1 });

const getById = (id) => Skill.findOne({ skillId: id });

const create = (data) => Skill.create(data);

const update = async (id, data) => {
  return Skill.findOneAndUpdate({ skillId: id }, data, { new: true });
};

const remove = async (id) => {
  return Skill.findOneAndDelete({ skillId: id });
};

module.exports = { Skill, getAll, getById, create, update, remove };
