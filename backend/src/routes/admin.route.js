const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.controller.js");
const authenticate = require("../middleware/authenticate.js");
const { isAdmin } = require("../middleware/authenticate.js");

// Admin Auth
router.post("/login", adminController.adminLogin);
router.post("/first-admin", adminController.createFirstAdmin);

// Admin Management
router.get("/admins", authenticate, isAdmin, adminController.getAllAdmins);
router.post("/admins", authenticate, isAdmin, adminController.createAdmin);
router.delete("/admins/:id", authenticate, isAdmin, adminController.deleteAdmin);

// Customer Management
router.get("/customers", authenticate, isAdmin, adminController.getAllCustomers);
router.get("/customers/:id", authenticate, isAdmin, adminController.getCustomerById);
router.put("/customers/:id/block", authenticate, isAdmin, adminController.blockOrUnblockCustomer);
router.delete("/customers/:id", authenticate, isAdmin, adminController.deleteCustomer);
router.put("/customers/:id", authenticate, isAdmin, adminController.updateCustomer);
router.post("/customers", authenticate, isAdmin, adminController.createCustomer);

module.exports = router; 