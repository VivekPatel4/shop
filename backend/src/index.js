const express=require("express")
const cors=require("cors")
const fs = require('fs');
const path = require('path');

const app=express()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    return res.status(200).send({message : "Welcome to my-app api - node",status:true})
})

const authRouters=require("./routes/auth.route.js");
app.use("/auth",authRouters);

const userRouters=require("./routes/user.route.js");
app.use("/api/users",userRouters);

const productRouter=require("./routes/product.routes.js");
app.use("/api/products",productRouter);

const adminProductRouter=require("./routes/adminProduct.routes.js");
app.use("/api/admin/products",adminProductRouter);

const cartRouter=require("./routes/cart.routes.js");
app.use("/api/cart",cartRouter);

const cartItemRouter=require("./routes/cartitem.routes.js");
app.use("/api/cart_items",cartItemRouter);

const orderRouter=require("./routes/order.routes.js");
app.use("/api/orders",orderRouter);

const adminOrderRouter=require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders",adminOrderRouter);

const reviewRouter=require("./routes/review.routes.js");
app.use("/api/reviews",reviewRouter);

const ratingRouter=require("./routes/rating.routes.js");
app.use("/api/ratings",ratingRouter);

const adminRouter = require("./routes/admin.route.js");
app.use("/api/admin", adminRouter);

const categoryRouter = require("./routes/category.route.js");
app.use("/api/categories", categoryRouter);

// Register payment route
const paymentRouter = require("./routes/payment.routes.js");
app.use("/api/payment", paymentRouter);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const uploadRouter = require("./routes/upload.routes.js");
app.use("/api/upload", uploadRouter);
app.use("/uploads", express.static(uploadsDir));

const wishlistRouter = require("./routes/wishlist.routes.js");
app.use("/api/wishlist", wishlistRouter);

const adminAnalyticsRouter = require("./routes/adminAnalytics.routes.js");
app.use("/api/admin/analytics", adminAnalyticsRouter);

module.exports=app;