const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    // Main Category ka naam (e.g., Rajniti)
    name: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    // Sub-categories ka array (e.g., UP Rajniti, Bihar Rajniti)
    subCategories: [
        { 
            name: { 
                type: String,
                trim: true
            },
            // Har sub-category ki apni unique ID automatic ban jayegi
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { 
    timestamps: true // Isse pata chalega category kab bani
});

module.exports = mongoose.model('Category', CategorySchema);