const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  subtitle:    { type: String, required: true },
  description: { type: String, required: true },
  iconName:    { type: String, required: true },
  iconColor:   { type: String, required: true },
  dotBg:       { type: String, required: true }
});

const Service = mongoose.model('Service', serviceSchema);

// ───── CRUD ─────

const getAll = () => Service.find().sort({ serviceId: 1 });

const getById = (id) => Service.findOne({ serviceId: id });

const create = (data) => Service.create(data);

const update = async (id, data) => {
  return Service.findOneAndUpdate({ serviceId: id }, data, { new: true });
};

const remove = async (id) => {
  return Service.findOneAndDelete({ serviceId: id });
};

module.exports = { Service, getAll, getById, create, update, remove };
