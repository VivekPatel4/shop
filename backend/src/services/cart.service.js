const Cart=require("../models/cart.model");
const CartItem = require("../models/cartitem.model");
const Product = require("../models/product.model");
async function createCart(user){
    try {
        const cart=new Cart({user});
        const createdCart=await cart.save();
        return createdCart;        
    } catch (error) {
        throw new Error(error.message);
    }
    
}


async function findUserCart(userId){
    try {
        if (!userId) {
            throw new Error("No userId provided to findUserCart");
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId });
            await cart.save();
        }

        let cartItems = [];
        if (cart._id) {
            cartItems = await CartItem.find({ cart: cart._id }).populate("product");
        }
        cart.cartItems = cartItems;

        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItem = 0;

        for (let cartItem of cart.cartItems) {
            totalPrice += cartItem.price || 0;
            totalDiscountedPrice += cartItem.discountedPrice || 0;
            totalItem += cartItem.quantity || 0;
        }

        cart.totalPrice = totalPrice;
        cart.totalItem = totalItem;
        cart.discounte = totalPrice - totalDiscountedPrice;

        return cart;
    } catch (error) {
        console.error("findUserCart error:", error);
        throw new Error(error.message)
    }
}


async function addCartItem(userId,req){
    try {
        const cart=await Cart.findOne({user:userId});
        const product=await Product.findById(req.productId);

        const isPresent=await CartItem.findOne({cart:cart._id,product:product._id,userId});
        if(!isPresent){
            const cartItem=new CartItem({
                product:product._id,
                cart:cart._id,
                quantity:req.quantity,
                userId,
                price:req.price,
                size:req.size,
                discountedPrice:req.discountedPrice,
            })
            const createdCartItem=await cartItem.save();
            cart.cartItems.push(createdCartItem);
            await cart.save();
            return "Item added to cart";
        }

    } catch (error) {
        throw new Error(error.message);
    }
}



module.exports={createCart,findUserCart,addCartItem}