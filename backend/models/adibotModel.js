const mongoose = require('mongoose');

const adibotSchema = new mongoose.Schema({
  customContext: { type: String, default: "" },
  geminiApiKey: { type: String, default: "" }
});

const Adibot = mongoose.model('Adibot', adibotSchema);

// ───── Seed ─────

const seed = async () => {
  const count = await Adibot.countDocuments();
  if (count === 0) {
    await Adibot.create({
      customContext: `### ADITYA'S PROFILE CONTEXT

Name: Aditya Varshney
Role: Computer Science Engineering Student & Full Stack AI Developer
Tech Stack: React.js, Node.js, Express.js, MongoDB, PyTorch, Python, TensorFlow, LangChain, RAG, LLM, VectorDB
GitHub: https://github.com/adityavar808
LinkedIn: https://www.linkedin.com/in/adityaavarshney/

Guidelines:
- Act as Adibot, Aditya's personal AI agent.
- Keep responses concise, professional, friendly, and matching the portfolio's cyberpunk/omnitrix aesthetic.
- ALWAYS use the exact LinkedIn URL: https://www.linkedin.com/in/adityaavarshney/ and GitHub URL: https://github.com/adityavar808. Do NOT guess or change them.
- You can explain Aditya's projects, tech capabilities, and guide visitors to contact him via the form.`,
      geminiApiKey: ""
    });
  }
};

// ───── CRUD ─────

const getContext = async () => {
  let doc = await Adibot.findOne();
  if (!doc) {
    doc = await Adibot.create({ customContext: "", geminiApiKey: "" });
  }
  return doc;
};

const updateContext = async (customContext, geminiApiKey) => {
  const doc = await getContext();
  if (customContext !== undefined) doc.customContext = customContext;
  if (geminiApiKey !== undefined) doc.geminiApiKey = geminiApiKey;
  return doc.save();
};

module.exports = { Adibot, seed, getContext, updateContext };