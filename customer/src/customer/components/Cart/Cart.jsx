import React, { useEffect, useState } from 'react';
import { cartService } from '../../../Data/api';
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from 'react-icons/fa';

const Cart = () => {
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await cartService.getCart();
                setCart(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleUpdateQuantity = async (cartItemId, quantity) => {
        const item = cart.cartItems.find(ci => ci._id === cartItemId);
        const price = Number.isFinite(item.product?.price) ? item.product.price : 0;
        const discountedPrice = Number.isFinite(item.product?.discountedPrice)
            ? item.product.discountedPrice
            : price;
        await cartService.updateCartItem(cartItemId, {
            quantity,
            price,
            discountedPrice
        });
        const response = await cartService.getCart();
        setCart(response.data);
    };

    const handleRemoveItem = async (productId) => {
        try {
            await cartService.removeFromCart(productId);
            const response = await cartService.getCart();
            setCart(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
    if (error) return <div className="flex justify-center items-center min-h-[40vh] text-red-500">Error: {error}</div>;
    if (!cart.cartItems || cart.cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <button
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                    onClick={() => navigate('/')}
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-3xl mx-auto mt-24">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            {(cart.cartItems || []).map((item) => (
                <div key={item._id} className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <img
                                src={item.product?.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/60x60?text=No+Image'}
                                alt={item.product?.name}
                                className="cart-item-image"
                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 16 }}
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                                <p className="text-gray-600">${item.product?.price}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item._id, parseInt(e.target.value))}
                                className="w-16 text-center border rounded"
                            />
                            <button
                                className="ml-4 text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveItem(item._id)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {/* Cart Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between items-center">
                <div className="mb-2 sm:mb-0">
                    <span className="font-semibold">Total Items:</span> {cart.totalItem || 0}
                </div>
                <div className="mb-2 sm:mb-0">
                    <span className="font-semibold">Total Price:</span> ${cart.totalPrice || 0}
                </div>
                <div>
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
