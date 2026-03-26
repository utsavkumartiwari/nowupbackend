const mongoose = require('mongoose');

const BreakingNewsSchema = new mongoose.Schema({
    headlines: {
        type: [String],
        default: ["", "", "", "", "", ""]
    }
}, { timestamps: true });

module.exports = mongoose.model('BreakingNews', BreakingNewsSchema);