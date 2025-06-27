import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../customer/pages/HomePage/HomePage";
import Cart from "../customer/components/Cart/Cart";
import Navigation from "../customer/components/navigation/navigation";
import Footer from "../customer/components/Footer/Footer";
import Product from "../customer/components/Product/Product";
import ProductDetails from "../customer/components/ProductDetails/ProductDetails";
import Checkout from "../customer/components/Checkout/Checkout";
import Order from "../customer/components/Order/Order";
import OrderDetails from "../customer/components/Order/OrderDetails";
import SignIn from "../customer/components/Auth/SignIn";
import SignUp from "../customer/components/Auth/SignUp";
import Profile from "../customer/components/Profile/Profile";
import Products from "../customer/pages/Products/Products";
import OrderConfirmation from "../customer/components/Order/OrderConfirmation";
import Wishlist from "../customer/pages/Wishlist";

const CustomerRouters = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    return (
        <div>
            {!isAuthPage && (
            <div>
                    <Navigation />
            </div>
            )}
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/login" element={<SignIn />}></Route>
                <Route path="/register" element={<SignUp />}></Route>
                <Route path="/cart" element={<Cart />}></Route>
                <Route path="/products" element={<Products />}></Route>
                <Route path="/category/:categoryId/sub/:subId" element={<Product />}></Route>
                <Route path="/product/:id" element={<ProductDetails />}></Route>
                <Route path="/checkout" element={<Checkout />}></Route>
                <Route path="/account/order" element={<Order />}></Route>
                <Route path="/account/order/:orderId" element={<OrderDetails />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/wishlist" element={<Wishlist />}></Route>
                <Route path="/order-confirmation" element={<OrderConfirmation />}></Route>
            </Routes>
            {!isAuthPage && (
            <div>
                    <Footer />
            </div>
            )}
        </div>
    );
};

export default CustomerRouters;