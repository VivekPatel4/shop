const Category = require("../models/category.model");

exports.createCategory = async (req, res) => {
    try {
        const { name, description, parentCategory } = req.body;
        const category = new Category({ name, description, parentCategory });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ parentCategory: null, isActive: true })
            .populate({
                path: 'subcategories',
                match: { isActive: true }
            });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSubcategories = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const subcategories = await Category.find({ 
            parentCategory: categoryId,
            isActive: true 
        });
        res.json(subcategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const category = await Category.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 