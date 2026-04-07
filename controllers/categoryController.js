const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');


// ===================== CATEGORY =====================

// ✅ GET ALL (WITH SUBCATEGORY)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: "1" }).lean();
    const subCategories = await SubCategory.find({ status: "1" }).lean();

    const finalData = categories.map(cat => {
      const subs = subCategories.filter(
        sub => String(sub.category_id) === String(cat.id)
      );

      return {
        ...cat,
        subCategories: subs
      };
    });

    res.json({
      success: true,
      data: finalData
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ ADD CATEGORY
exports.addCategory = async (req, res) => {
  try {

    // 🔥 LAST CATEGORY FIND KARO
    const lastCategory = await Category.findOne().sort({ _id: -1 });

    const newId = lastCategory ? (parseInt(lastCategory.id) + 1).toString() : "1";

    const category = new Category({
      id: newId,
      name: req.body.name,
      slug_url: req.body.slug_url,
      status: "1",
      seo_content: null,
      image1: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    await category.save();

    res.status(201).json({
      success: true,
      data: category
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated_at: new Date().toISOString()
      },
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);

    // SubCategory bhi delete karo
    await SubCategory.deleteMany({ category_id: cat.id });

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category + SubCategory deleted"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// ===================== SUB CATEGORY =====================

// ✅ ADD SUBCATEGORY
exports.addSubCategory = async (req, res) => {
  try {

    // 🔥 LAST SUBCATEGORY FIND KARO
    const lastSub = await SubCategory.findOne().sort({ _id: -1 });

    const newId = lastSub ? (parseInt(lastSub.id) + 1).toString() : "1";

    const sub = new SubCategory({
      id: newId,
      user_id: "1",
      category_id: req.params.id,
      name: req.body.name,
      slug_url_subcat: req.body.slug_url_subcat,
      seo_content: null,
      status: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    await sub.save();

    res.status(201).json({
      success: true,
      data: sub
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ UPDATE SUBCATEGORY
exports.updateSubCategory = async (req, res) => {
  try {
    const updated = await SubCategory.findByIdAndUpdate(
      req.params.subId,
      {
        ...req.body,
        updated_at: new Date().toISOString()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "SubCategory updated",
      data: updated
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ DELETE SUBCATEGORY
exports.deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.subId);

    res.json({
      success: true,
      message: "SubCategory deleted"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};