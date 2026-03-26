const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { verifyAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const BreakingNews = require('../models/BreakingNews');

// 1. Image Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 2. Fetch All News Route (Yeh 404 error fix karega)
router.get('/all', async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: "Error fetching news", error: err.message });
    }
});




// 3. Add News Route
// 3. Add News Route (UPDATED)
router.post('/add', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        // --- YAHAN 'subCategory' ADD KIYA HAI ---
        const { 
            title, shortTitle, description, category, subCategory, date, 
            slugUrl, summary, reporter, breakingNews, status, 
            metaKeyword, metaDescription 
        } = req.body;

        if (!title || !description || !category || !date) {
            return res.status(400).json({ 
                message: "Validation Error", 
                error: "Title, Category, Description aur Date zaruri hain." 
            });
        }

        const newNews = new News({
            title, 
            shortTitle,
            description, 
            category, 
            subCategory: subCategory || '', // <--- AB YEH DATABASE MEIN JAYEGA
            date,
            slugUrl: slugUrl || '',
            summary: summary || '',
            reporter: reporter || 'Admin',
            breakingNews: breakingNews || 'No',
            status: status || 'Active',
            metaKeyword: metaKeyword || '',
            metaDescription: metaDescription || '',
            image: req.file ? req.file.path : ''
        });

        await newNews.save();
        res.status(201).json({ message: "News Saved Successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Database Error", error: err.message });
    }
});

// News ko Update (Edit) karne ka route (UPDATED)
router.put('/update/:id', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        // req.body mein ab subCategory bhi automatic aa jayegi kyunki humne {...req.body} use kiya hai
        const updateData = { ...req.body };
        
        if (req.file) {
            updateData.image = req.file.path; 
        }

        const updatedNews = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        if (!updatedNews) return res.status(404).json({ message: "News nahi mili" });
        
        res.json({ message: "News Updated Successfully!", updatedNews });
    } catch (err) {
        res.status(500).json({ message: "Update Error", error: err.message });
    }
});

// News ko Delete karne ka route
router.delete('/delete/:id', verifyAdmin, async (req, res) => {
    try {
        const deletedNews = await News.findByIdAndDelete(req.params.id);
        if (!deletedNews) return res.status(404).json({ message: "News nahi mili" });
        
        res.json({ message: "News Deleted Successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Delete Error", error: err.message });
    }
});


// 1. GET Breaking News (Fetch karne ke liye)
router.get('/breaking-news', async (req, res) => {
    try {
        let data = await BreakingNews.findOne();
        if (!data) {
            return res.json({ headlines: ["", "", "", "", "", ""] });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching news", error: err });
    }
});

// 2. POST Breaking News (Update ya Create karne ke liye)
router.post('/breaking-news', async (req, res) => {
    try {
        const { headlines } = req.body;
        let data = await BreakingNews.findOne();
        
        if (data) {
            data.headlines = headlines;
            await data.save();
        } else {
            data = new BreakingNews({ headlines });
            await data.save();
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error saving news", error: err });
    }
});



module.exports = router;