const express=require("express")
const router=express.Router();
const userController=require("../controller/user.controller.js")
const authenticate = require("../middleware/authenticate.js");

router.get("/profile", authenticate, userController.getUserProfile);
router.get("/", userController.getAllUsers);

// Address management
router.get("/addresses", authenticate, userController.getAddresses);
router.post("/addresses", authenticate, userController.addAddress);
router.put("/addresses/:id", authenticate, userController.updateAddress);
router.delete("/addresses/:id", authenticate, userController.deleteAddress);

// Profile update
router.put("/profile", authenticate, userController.updateProfile);

module.exports=router;