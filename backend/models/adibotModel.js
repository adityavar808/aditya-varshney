const mongoose = require('mongoose');

const adibotSchema = new mongoose.Schema({
  customContext: { type: String, default: "" },
  geminiApiKey: { type: String, default: "" }
});

const Adibot = mongoose.model('Adibot', adibotSchema);

// ───── CRUD ─────

const getContext = async () => {
  let doc = await Adibot.findOne();
  if (!doc) {
    doc = await Adibot.create({ customContext: '', geminiApiKey: '' });
  }
  return doc;
};

const updateContext = async (customContext, geminiApiKey) => {
  const doc = await getContext();
  if (customContext !== undefined) doc.customContext = customContext;
  if (geminiApiKey !== undefined) doc.geminiApiKey = geminiApiKey;
  return doc.save();
};

module.exports = { Adibot, getContext, updateContext };