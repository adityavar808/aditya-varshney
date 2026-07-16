const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true },
  message:       { type: String, required: true },
  dateSubmitted: { type: String, required: true }
});

const Contact = mongoose.model('Contact', contactSchema);

// ───── CRUD ─────

const getAll = () => Contact.find().sort({ _id: -1 });

const getById = (id) => Contact.findById(id);

const create = ({ name, email, message }) => {
  const dateSubmitted = new Date().toLocaleString();
  return Contact.create({ name, email, message, dateSubmitted });
};

const remove = (id) => Contact.findByIdAndDelete(id);

module.exports = { Contact, getAll, getById, create, remove };
