const express=require("express")
const router=express.Router();

const productController=require("../controller/product.controller.js");
const authenticate=require("../middleware/authenticate.js");

router.get("/", productController.getAllProducts);
router.get("/id/:id", productController.findProductById);
router.post("/", authenticate, productController.createProduct);
router.post("/creates", authenticate, productController.createMultipleProduct);
router.put("/:id", authenticate, productController.updateProduct);
router.delete("/:id", authenticate, productController.deleteProduct);

module.exports=router;