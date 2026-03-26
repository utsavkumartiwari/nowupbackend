const ShortVideo = require("../models/ShortVideo");

exports.uploadShortVideos = async (req, res) => {
  try {
    // Admin se bheje gaye captions nikalna (Frontend se captions[0], captions[1]... aata hai)
    const { captions } = req.body; 
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No videos uploaded" });
    }

    // Naya data structure taiyar karna (Object format mein)
    const updatedVideos = files.map((file, index) => ({
      videoUrl: `/uploads/shorts/${file.filename}`,
      caption: captions && captions[index] ? captions[index] : "" // Agar caption hai to lo, warna empty
    }));

    // Database mein update ya create karein
    let record = await ShortVideo.findOne();
    if (record) {
      record.videos = updatedVideos;
      await record.save();
    } else {
      await ShortVideo.create({ videos: updatedVideos });
    }

    res.status(200).json({ success: true, videos: updatedVideos });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getShortVideos = async (req, res) => {
  try {
    const record = await ShortVideo.findOne();
    // Pura array of objects return karein [{videoUrl, caption}, ...]
    res.json(record ? record.videos : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

