// backend/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/Video'); // Aapka Model

// Multer Setup (Video save karne ke liye)
const storage = multer.diskStorage({
    destination: 'uploads/videos/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// API: Video Upload
router.post('/upload-main-video', upload.single('video'), async (req, res) => {
    try {
        const videoPath = req.file.path;
        // Puraani video ko update karega ya nayi banayega
        const updatedVideo = await Video.findOneAndUpdate(
            {}, 
            { videoPath: videoPath, updatedAt: Date.now() }, 
            { upsert: true, new: true }
        );
        res.json({ success: true, path: videoPath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Video Get
router.get('/get-main-video', async (req, res) => {
    try {
        const video = await Video.findOne();
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;