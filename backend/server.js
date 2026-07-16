require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// ───── Models (for seeding) ─────
const AboutModel = require('./models/aboutModel');
const ServiceModel = require('./models/serviceModel');
const ProjectModel = require('./models/projectModel');
const SkillModel = require('./models/skillModel');
const AdibotModel = require('./models/adibotModel');

// ───── Routes ─────
const authRoutes = require('./routes/authRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adibotRoutes = require('./routes/adibotRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ───── Global Middleware ─────
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ───── Route Mounting ─────
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/adibot', adibotRoutes);
app.use('/api/upload', uploadRoutes);

// ───── Database Connection & Seeding ─────
const seedDatabase = async () => {
  await AboutModel.seed();
  await ServiceModel.seed();
  await ProjectModel.seed();
  await SkillModel.seed();
  await AdibotModel.seed();
  console.log('Database seeded successfully (empty collections populated).');
};

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal: Failed to start database/server.', err);
    process.exit(1);
  }
};

startServer();
