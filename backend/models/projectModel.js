const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId:    { type: String, required: true, unique: true },
  name:         { type: String, required: true },
  category:     { type: String, required: true },
  liveUrl:      { type: String, required: true },
  images:       [{ type: String }],
  imgCol1Top:   { type: String },
  imgCol1Bottom:{ type: String },
  imgCol2:      { type: String }
});

const Project = mongoose.model('Project', projectSchema);

// ───── CRUD ─────

const getAll = () => Project.find().sort({ projectId: 1 });

const getById = (id) => Project.findOne({ projectId: id });

const create = (data) => Project.create(data);

const update = async (id, data) => {
  return Project.findOneAndUpdate({ projectId: id }, data, { new: true });
};

const remove = async (id) => {
  return Project.findOneAndDelete({ projectId: id });
};

module.exports = { Project, getAll, getById, create, update, remove };
