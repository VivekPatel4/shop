const CartItem = require("../models/cartitem.model");
const userService=require("../services/user.service.js");


async function updateCartItem(userId,cartItemId,cartItemData){
    try {
        const item=await findCartItemById(cartItemId);
        if(!item){
            throw new Error("cart item not found :",cartItemId)
        }
        const user=await userService.findUserById(item.userId);
        if(!user){
            throw new Error("user not found : ",userId)
        }

        if(user._id.toString()===userId.toString()){
            item.quantity = cartItemData.quantity;
            const price = Number.isFinite(cartItemData.price) ? cartItemData.price : item.product.price;
            const discountedPrice = Number.isFinite(cartItemData.discountedPrice)
                ? cartItemData.discountedPrice
                : price;
            item.price = item.quantity * price;
            item.discountedPrice = item.quantity * discountedPrice;
            const updateCartItem = await item.save();
            return updateCartItem;
        }
        else{
            throw new Error("you can't update this cart item");
        }
    } catch (error) {
        throw new Error(error.message)
    }
}


async function removeCartItem(userId,cartItemId) {
    const cartItem=await findCartItemById(cartItemId);
    const user=await userService.findUserById(userId);
    
    if(user._id.toString()===cartItem.userId.toString()){
       return await CartItem.findByIdAndDelete(cartItemId);
    }
    throw new Error("you cant remove another user's item ");
}

async function findCartItemById(cartItemId) {
    const cartItem=await CartItem.findById(cartItemId).populate("product");
    if(cartItem){
        return cartItem
    }
    else{
        throw new Error("cartitem not found with id",cartItemId);
    }
}


module.exports={updateCartItem,removeCartItem,findCartItemById}