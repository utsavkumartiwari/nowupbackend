const Category = require('../models/Category');


// 1. Saari Categories lana
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Nayi Category add karna
exports.addCategory = async (req, res) => {
    try {
        const newCat = new Category({ name: req.body.name });
        await newCat.save();
        res.status(201).json(newCat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Main Category Update (Edit) karna
exports.updateCategory = async (req, res) => {
    try {
        const updatedCat = await Category.findByIdAndUpdate(
            req.params.id, 
            { name: req.body.name }, 
            { new: true }
        );
        res.status(200).json(updatedCat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Main Category Delete karna
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Category Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Sub-category add karna
exports.addSubCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        category.subCategories.push({ name: req.body.name });
        await category.save();
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. Sub-Category Update (Edit) karna
exports.updateSubCategory = async (req, res) => {
    try {
        const { catId, subId } = req.params;
        const category = await Category.findById(catId);
        
        const subCat = category.subCategories.id(subId);
        if (!subCat) return res.status(404).json({ message: "Sub-category nahi mili" });
        
        subCat.name = req.body.newName;
        await category.save();
        
        res.status(200).json({ message: "Sub-Category Updated", category });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 7. Sub-Category Delete karna
exports.deleteSubCategory = async (req, res) => {
    try {
        const { catId, subId } = req.params;
        await Category.findByIdAndUpdate(catId, {
            $pull: { subCategories: { _id: subId } }
        });
        res.status(200).json({ message: "Sub-Category Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 1. Saari Categories lana
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Nayi Category add karna
exports.addCategory = async (req, res) => {
    try {
        const newCat = new Category({ name: req.body.name });
        await newCat.save();
        res.status(201).json(newCat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Main Category Update (Edit) karna
exports.updateCategory = async (req, res) => {
    try {
        const updatedCat = await Category.findByIdAndUpdate(
            req.params.id, 
            { name: req.body.name }, 
            { new: true }
        );
        res.status(200).json(updatedCat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Main Category Delete karna
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Category Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Sub-category add karna
exports.addSubCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        category.subCategories.push({ name: req.body.name });
        await category.save();
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. Sub-Category Update (Edit) karna
exports.updateSubCategory = async (req, res) => {
    try {
        const { catId, subId } = req.params;
        const category = await Category.findById(catId);
        
        const subCat = category.subCategories.id(subId);
        if (!subCat) return res.status(404).json({ message: "Sub-category nahi mili" });
        
        subCat.name = req.body.newName;
        await category.save();
        
        res.status(200).json({ message: "Sub-Category Updated", category });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 7. Sub-Category Delete karna
exports.deleteSubCategory = async (req, res) => {
    try {
        const { catId, subId } = req.params;
        await Category.findByIdAndUpdate(catId, {
            $pull: { subCategories: { _id: subId } }
        });
        res.status(200).json({ message: "Sub-Category Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};