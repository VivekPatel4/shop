const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category.controller");
const authenticate = require("../middleware/authenticate");
const { isAdmin } = require("../middleware/authenticate");

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:categoryId/subcategories", categoryController.getSubcategories);

// Admin routes
router.post("/", authenticate, isAdmin, categoryController.createCategory);
router.put("/:id", authenticate, isAdmin, categoryController.updateCategory);
router.delete("/:id", authenticate, isAdmin, categoryController.deleteCategory);

module.exports = router; 