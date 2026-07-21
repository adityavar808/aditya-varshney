const express = require('express');
const multer  = require('multer');
const { GridFSBucket, ObjectId } = require('mongodb');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const uploadRouter = express.Router();  // POST /api/upload
const imageRouter  = express.Router();  // GET  /api/images/:id

// ─── Lazy GridFS Storage ──────────────────────────────────────────────────────
// We defer creating GridFsStorage until the first request so that
// process.env.MONGODB_URI is guaranteed to be loaded by then.
let _upload = null;

function getUpload() {
  if (_upload) return _upload;

  const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      const allowed = /jpeg|jpg|png|webp|gif/;
      const extOk   = allowed.test(file.originalname.toLowerCase().split('.').pop());
      const mimeOk  = allowed.test(file.mimetype);
      if (!extOk || !mimeOk) {
        return Promise.reject(
          new Error('Only images (jpg, jpeg, png, webp, gif) are allowed')
        );
      }
      const ext = file.originalname.split('.').pop().toLowerCase();
      return {
        bucketName: 'portfolioImages',
        filename: `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`
      };
    }
  });

  _upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }  // 5 MB
  });

  return _upload;
}

// ─── POST /api/upload ─────────────────────────────────────────────────────────
// Accepts multipart field "image", stores in GridFS, returns a permanent URL.
// Images live in MongoDB Atlas → survive Railway redeploys.
uploadRouter.post('/', authenticateAdmin, (req, res) => {
  getUpload().single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    // Permanent URL: served from /api/images/:id via MongoDB GridFS
    const fileUrl = `${req.protocol}://${req.get('host')}/api/images/${req.file.id}`;
    res.status(200).json({ url: fileUrl });
  });
});

// ─── GET /api/images/:id ──────────────────────────────────────────────────────
// Streams the image from GridFS to the browser.
imageRouter.get('/:id', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    const db     = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'portfolioImages' });

    // Check the file exists first
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const file = files[0];
    res.set('Content-Type',  file.contentType || 'image/jpeg');
    // Immutable 1-year cache — IDs never change for a given image
    res.set('Cache-Control', 'public, max-age=31536000, immutable');

    const stream = bucket.openDownloadStream(fileId);
    stream.on('error', () => res.status(404).json({ error: 'Stream error' }));
    stream.pipe(res);
  } catch (err) {
    if (err.message?.includes('24 hex') || err.name === 'BSONTypeError') {
      return res.status(400).json({ error: 'Invalid image ID' });
    }
    console.error('GridFS image serve error:', err);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

module.exports = { uploadRouter, imageRouter };
