const express = require('express');
const router = express.Router();
const catController = require('../controllers/categoryController');

// Existing Routes
router.post('/add', catController.addCategory);
router.post('/add-sub/:id', catController.addSubCategory);
router.get('/all', catController.getAllCategories);

// --- New Routes for Delete and Edit ---

// 1. Category ko Delete karne ke liye
router.delete('/delete/:id', catController.deleteCategory);

// 2. Category ka Naam Edit karne ke liye (Main Category)
router.put('/update/:id', catController.updateCategory);

// 3. Sub-Category ko Delete karne ke liye (Optional par zaroori hai)
// Isme Category ID aur Sub-Category ID dono ki zaroorat padegi
router.delete('/delete-sub/:catId/:subId', catController.deleteSubCategory);

module.exports = router;