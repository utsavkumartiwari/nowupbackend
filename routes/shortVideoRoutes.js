const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ShortVideo = require('../models/ShortVideo');

// 1. Folder check karein (agar nahi hai toh bana dega)
const uploadDir = 'uploads/shorts';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/shorts');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 } // 50MB limit
});

// 3. POST Route (Admin ke liye)

router.post('/upload-shorts', upload.array('shortVideos', 6), async (req, res) => {
  try {
    const { captions } = req.body; // Frontend se captions nikalna
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No videos uploaded" });
    }

    // YAHAN BADLAV: Sirf string nahi, Object ka array banayenge
    const updatedVideos = files.map((file, index) => ({
      videoUrl: `/uploads/shorts/${file.filename}`,
      caption: captions && captions[index] ? captions[index] : "" // Caption yahan add ho raha hai
    }));
    
    // Database mein save karein
    await ShortVideo.deleteMany({}); 
    const newShorts = new ShortVideo({ videos: updatedVideos });
    await newShorts.save();

    res.status(200).json({ success: true, videos: updatedVideos });
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Slider ke liye GET route bhi yahan add karein

router.get('/all-shorts', async (req, res) => {
  try {
    const data = await ShortVideo.findOne();
    res.status(200).json(data ? data.videos : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;