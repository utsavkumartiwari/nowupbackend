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
        cb(null, 'uploads/news'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 2. Fetch All News Route (Yeh 404 error fix karega)
router.get('/all', async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    let filter = {
      status: { $in: ["1", "Active"] },
      admin_check: "1"
    };

    if (category) {
      filter.category_id = String(category).trim();
    }

    if (subCategory) {
      filter.sub_category_id = String(subCategory).trim();
    }

    // 🔥 STEP 1: news lao
    const news = await News.find(filter)
      .sort({ createdAt: -1, created_at: -1 })
      .limit(50)
      .lean();

    // 🔥 STEP 2: users lao
    const User = require('../models/User');
    const users = await User.find().lean();

    // 🔥 STEP 3: old mapping
    const oldUserMap = {
      "1": "Shiv Vishwakarma",
      "9": "Shiv Vishwakarma"
    };

    // 🔥 STEP 4: author_name add karo
    const result = news.map(item => {
      // OLD DATA
      if (oldUserMap[item.user_id]) {
        return {
          ...item,
          author_name: oldUserMap[item.user_id]
        };
      }

      // NEW DATA
      const user = users.find(
        u => u._id.toString() === item.user_id
      );

      return {
        ...item,
        author_name: user ? user.name : "Unknown"
      };
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let news;

    const mongoose = require('mongoose');

    // 👇 check karo id hai ya slug
    if (mongoose.Types.ObjectId.isValid(id)) {
      news = await News.findById(id).lean();
    } else {
      news = await News.findOne({ slug: id }).lean();
    }

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const User = require('../models/User');
    const users = await User.find().lean();

    const oldUserMap = {
      "1": "Shiv Vishwakarma",
      "9": "Shiv Vishwakarma"
    };

    let author_name = "Unknown";

    if (oldUserMap[news.user_id]) {
      author_name = oldUserMap[news.user_id];
    } else {
      const user = users.find(
        u => u._id.toString() === news.user_id
      );
      author_name = user ? user.name : "Unknown";
    }

    res.json({
      ...news,
      author_name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching news" });
  }
});

// 3. Add News Route
// 3. Add News Route (UPDATED)
router.post('/add', verifyAdmin, upload.single('image'), async (req, res) => {
    try {

        const {
            title,
            short_description,
            slug,
            description,
            category_id,
            sub_category_id,
            tags,
            user_id,
            status,
            meta_keyword,
            meta_description
        } = req.body;

        if (!title || !description || !category_id) {
            return res.status(400).json({
                message: "Validation Error",
                error: "Title, Category aur Description required hain"
            });
        }

        const newNews = new News({
            title,
            short_description: short_description || '',
            slug: slug || '',
            description,

            category_id,
            sub_category_id: sub_category_id || '',

            tags: tags || '',

            // user_id: user_id || '',
            user_id: req.user.id,
            status: status || '1',

            meta_keyword: meta_keyword || '',
            meta_description: meta_description || '',

            image: req.file ? req.file.filename : ''
        });

        await newNews.save();

        res.status(201).json({
            message: "News Saved Successfully!"
        });

    } catch (err) {
        res.status(500).json({
            message: "Database Error",
            error: err.message
        });
    }
});

// News ko Update (Edit) karne ka route (UPDATED)
router.put('/update/:id', verifyAdmin, upload.single('image'), async (req, res) => {
    try {

        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedNews = await News.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedNews) {
            return res.status(404).json({ message: "News nahi mili" });
        }

        res.json({
            message: "News Updated Successfully!",
            updatedNews
        });

    } catch (err) {
        res.status(500).json({
            message: "Update Error",
            error: err.message
        });
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
