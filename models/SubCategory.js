const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    id: {type: String, required: true},
    user_id: {type: String, default: "1"},
    category_id: {type: String,required: true}, // ⚠️ IMPORTANT (string hi rahega)
    name: {type: String, required: true, trim: true},
    slug_url_subcat: {type: String, required: true, trim: true},
    seo_content: {type: String, default: null},
    status: {type: String, default: "1"},
    created_at: {type: String, default: new Date().toISOString()},
    updated_at: {type: String, default: new Date().toISOString()}
});

module.exports = mongoose.model('SubCategory', subCategorySchema);