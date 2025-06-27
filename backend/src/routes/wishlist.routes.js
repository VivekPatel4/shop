const express = require("express");
const router = express.Router();
const wishlistController = require("../controller/wishlist.controller.js");
const authenticate = require("../middleware/authenticate.js");

router.get("/", authenticate, wishlistController.getWishlist);
router.post("/add", authenticate, wishlistController.addToWishlist);
router.delete("/remove/:productId", authenticate, wishlistController.removeFromWishlist);

module.exports = router; 