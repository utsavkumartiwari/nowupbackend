const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes'); 
const videoRoutes = require('./routes/videoRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ ROOT ROUTE (IMPORTANT)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Routes
app.use('/api/auth', authRoutes); 
app.use('/api/news', newsRoutes); 
app.use('/api/category', require('./routes/categoryRoutes'));
app.use('/api', videoRoutes);
app.use('/api/shorts', require('./routes/shortVideoRoutes'));

// ✅ DB + Server start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Database Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB Error:", err);
  });
