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

// ───── Seed ─────

const seed = async () => {
  const count = await Skill.countDocuments();
  if (count === 0) {
    await Skill.insertMany([
      { skillId: "skill-pytorch", name: "PyTorch", tagline: "Deep Learning & Neural Networks", glow: "rgba(238, 76, 44, 0.25)", border: "border-[#EE4C2C]/30", iconType: "svg", iconContent: '<path d="M12.005.04l-7.03 7.03a9.832 9.832 0 0 0 0 13.975 9.833 9.833 0 0 0 13.976 0c3.97-3.887 3.972-10.171.084-13.976l-1.738 1.737c2.895 2.895 2.895 7.608 0 10.503-2.894 2.894-7.608 2.894-10.503 0C3.9 16.414 3.9 11.7 6.794 8.806l4.632-4.631.58-.663z"/>' },
      { skillId: "skill-react", name: "React", tagline: "Component-Driven Frontend Architectures", glow: "rgba(0, 216, 255, 0.25)", border: "border-[#00D8FF]/30", iconType: "svg", iconContent: '<circle cx="0" cy="0" r="2" fill="#00D8FF"/><g stroke="#00D8FF" strokeWidth="1" fill="none"><ellipse rx="10" ry="4.5"/><ellipse rx="10" ry="4.5" transform="rotate(60)"/><ellipse rx="10" ry="4.5" transform="rotate(120)"/></g>' },
      { skillId: "skill-python", name: "Python", tagline: "Backend Systems & Scientific Computing", glow: "rgba(55, 118, 171, 0.25)", border: "border-[#3776AB]/30", iconType: "svg", iconContent: '<path d="M14.31.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.83l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.24l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05 1.07.13zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01.21.03zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z"/>' },
      { skillId: "skill-tensorflow", name: "TensorFlow", tagline: "Scalable ML Models & Production Pipelines", glow: "rgba(255, 111, 0, 0.25)", border: "border-[#FF6F00]/30", iconType: "svg", iconContent: '<path d="M19.6 12l.1 4.7-3.1-1.8v6.7L12.5 24V0l10.2 5.9v5.3l-6.1-3.6v2.7zM1.3 5.9L11.5 0v24l-4.1-2.4v-14l-6.1 3.6z"/>' },
      { skillId: "skill-llms", name: "LLMs", tagline: "Generative AI & Prompt Engineering API", glow: "rgba(182, 0, 168, 0.25)", border: "border-[#B600A8]/30", iconType: "lucide", iconContent: "Brain" },
      { skillId: "skill-fastapi", name: "FastAPI", tagline: "Asynchronous High-Performance API Systems", glow: "rgba(5, 150, 105, 0.25)", border: "border-[#059669]/30", iconType: "svg", iconContent: '<circle cx="12" cy="12" r="10" fill="#009485"/><path d="M13 6l-6 7h5v5l6-7h-5z" fill="white"/>' }
    ]);
  }
};

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

module.exports = { Skill, seed, getAll, getById, create, update, remove };
