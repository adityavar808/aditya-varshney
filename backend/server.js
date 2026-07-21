require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

const express = require('express');
const cors    = require('cors');
const { connectDB } = require('./config/db');

// ───── Routes ─────
const authRoutes    = require('./routes/authRoutes');
const aboutRoutes   = require('./routes/aboutRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes   = require('./routes/skillRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adibotRoutes  = require('./routes/adibotRoutes');
const { uploadRouter, imageRouter } = require('./routes/uploadRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ───── Global Middleware ─────
app.use(cors());
app.use(express.json());

// ───── Route Mounting ─────
app.use('/api/auth',     authRoutes);
app.use('/api/about',    aboutRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills',   skillRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/adibot',   adibotRoutes);
app.use('/api/upload',   uploadRouter);  // POST — upload image → GridFS
app.use('/api/images',   imageRouter);   // GET  — stream image from GridFS

// ───── Start Server ─────
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal: failed to start server.', err);
    process.exit(1);
  }
};

startServer();
