const express=require("express")
const router=express.Router();

const orderController=require("../controller/order.controller.js");
const authenticate=require("../middleware/authenticate.js");

router.post("/",authenticate,orderController.createOrder);
router.get("/user",authenticate,orderController.orderHistory);
router.get("/:id",authenticate,orderController.findOrderById);
router.get("/",authenticate,orderController.orderHistory);



module.exports=router;