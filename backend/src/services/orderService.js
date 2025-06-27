const Address = require("../models/address.model.js");
const Order = require("../models/order.model.js");
const cartService = require("../services/cart.service.js");
const OrderItem=require("../models/orderitems.js");
async function createOrder(user, shippingAddress) {
  let address;
  if (shippingAddress._id) {
    let exitAddress = await Address.findById(shippingAddress._id);
    address = exitAddress;
  } else {
    address = new Address(shippingAddress);
    address.user = user._id;
    await address.save();

    if (!user.address) user.address = [];
    user.address.push(address._id);
    await user.save();
  }

  const cart = await cartService.findUserCart(user._id);
  const orderItems = [];

  for (const item of cart.cartItems) {
    const orderItem = new OrderItem({
      price: item.price,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      userId: item.userId,
      discountedPrice: item.discountedPrice,
    });

    const createdOrderItem = await orderItem.save();
    orderItems.push(createdOrderItem);
  }

  const createdOrder = new Order({
    user: user._id,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discounte: cart.discounte,
    totalItem: cart.totalItem,
    shippingAddress: address._id,
    orderStatus: "PLACED",
  });

  const saveOrder = await createdOrder.save();
  return saveOrder;
}

async function placeOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "PLACED";
  order.paymentDetails.status = "COMPLETED";

  return await order.save();
}

async function confirmedOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "ORDER_CONFIRMED";

  return await order.save();
}

async function shipOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "SHIPPED";

  return await order.save();
}

async function outForDeliveryOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "OUT_FOR_DELIVERY";

  return await order.save();
}

async function deliverOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "DELIVERED";
  order.deliveryDate = new Date();

  return await order.save();
}

async function cancelledOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CANCELLED";

  return await order.save();
}

async function findOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate("user", "_id firstName lastName email")
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress");

  return order;
}

async function usersOrderHistory(userId) {
  try {
    const orders = await Order.find({ user: userId })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllOrders() {
  return await Order.find()
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("user", "_id firstName lastName email")
    .populate("shippingAddress")
    .lean();
}

async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);
  await Order.findByIdAndDelete(order._id);
}

module.exports = {
  createOrder,
  placeOrder,
  confirmedOrder,
  shipOrder,
  outForDeliveryOrder,
  deliverOrder,
  cancelledOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
};
