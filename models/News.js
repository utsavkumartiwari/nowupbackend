const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortTitle: { type: String },
    slugUrl: { type: String, unique: true },
    summary: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    date: { type: String, required: true },
    tags: { type: String },
    speciality: { type: String },
    reporter: { type: String },
    status: { type: String, default: 'Active' },
    breakingNews: { type: String, default: 'No' },
    image: { type: String },
    metaKeyword: { type: String },
    metaDescription: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);