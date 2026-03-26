const mongoose = require('mongoose');

const ShortVideoSchema = new mongoose.Schema({
  videos: [String], // Isme 6 videos ke paths rahenge
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShortVideo', ShortVideoSchema);