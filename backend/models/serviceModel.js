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

// ───── Seed ─────

const seed = async () => {
  const count = await Service.countDocuments();
  if (count === 0) {
    await Service.insertMany([
      { serviceId: "01", name: "AI/ML Development", subtitle: "Intelligence.", description: "Building and deploying custom machine learning models, neural networks, and AI-driven solutions tailored to complex business needs, utilizing PyTorch, TensorFlow, and LLM APIs.", iconName: "Cpu", iconColor: "text-[#EE4C2C]", dotBg: "bg-[#EE4C2C]" },
      { serviceId: "02", name: "Fullstack Web Dev", subtitle: "Scalability.", description: "Developing robust, scalable web applications with polished responsive frontend interfaces and secure backend systems powered by React, Node.js, and modern databases.", iconName: "Server", iconColor: "text-[#00D8FF]", dotBg: "bg-[#00D8FF]" },
      { serviceId: "03", name: "UI/UX Design", subtitle: "Seamlessness.", description: "Designing modern, highly interactive, and user-centric interfaces with attention to layout, typography, and micro-interactions for seamless web applications.", iconName: "Layout", iconColor: "text-[#B600A8]", dotBg: "bg-[#B600A8]" },
      { serviceId: "04", name: "Cloud & DevOps", subtitle: "Automation.", description: "Deploying applications on AWS/GCP, setting up CI/CD pipelines, containerizing applications with Docker, and orchestrating them for high availability.", iconName: "Cloud", iconColor: "text-[#00C6FF]", dotBg: "bg-[#00C6FF]" },
      { serviceId: "05", name: "Creative Artistry", subtitle: "Vision.", description: "Integrating custom 3D web elements, shaders, and complex animations to create immersive, interactive digital experiences that stand out.", iconName: "Palette", iconColor: "text-[#FFAA00]", dotBg: "bg-[#FFAA00]" }
    ]);
  }
};

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

module.exports = { Service, seed, getAll, getById, create, update, remove };
