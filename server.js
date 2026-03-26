const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // 1. Yeh line sabse upar add karein

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes'); 
const videoRoutes = require('./routes/videoRoutes');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 2. Yahan yeh line rakhein taaki uploads folder public ho sake
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes ko activate karna
app.use('/api/auth', authRoutes); 
app.use('/api/news', newsRoutes); 
app.use('/api/category', require('./routes/categoryRoutes'));
// Iske bina video nahi dikhegi
app.use('/api', videoRoutes);

app.use('/api/shorts', require('./routes/shortVideoRoutes'));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ NowUP Database Connected Successfully!"))
  .catch((err) => console.log("❌ Database Connection Error:", err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});