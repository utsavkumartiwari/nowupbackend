const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },

    short_description: { type: String },
    slug: { type: String, unique: true },

    description: { type: String, required: true },

    category_id: { type: String, required: true },
    sub_category_id: { type: String },

    tags: { type: String },

    user_id: { type: String },

    status: { type: String, default: '1' },

    image: { type: String },

    meta_keyword: { type: String },
    meta_description: { type: String },

    is_featured: { type: String, default: '0' },
    trending: { type: String, default: '0' },
    views: { type: String, default: '0' },

    admin_check: { type: String, default: '1' }

}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);