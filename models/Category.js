const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true, trim: true},
    slug_url: {type: String, required: true, unique: true, trim: true},
    status: {type: String, default: "1"},
    seo_content: {type: String, default: null },
    image1: {type: String, default: null},
    created_at: {type: String},
    updated_at: {type: String}
});

module.exports = mongoose.model('Category', CategorySchema);