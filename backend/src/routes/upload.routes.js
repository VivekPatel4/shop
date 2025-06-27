const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up storage (this saves files to /uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST /api/upload
router.post('/', upload.array('images'), (req, res) => {
  const urls = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ urls });
});

module.exports = router; 