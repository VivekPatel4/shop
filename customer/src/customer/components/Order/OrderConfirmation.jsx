import React from "react";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <svg className="w-20 h-20 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
        </svg>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Thank you for your purchase!</h1>
        <p className="text-gray-700 mb-6 text-center max-w-md">
          Your order has been placed successfully. You will receive an email confirmation shortly.<br/>
          You can track your order status in your account.
        </p>
        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => navigate("/account/order")}
          >
            View My Orders
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-300 transition"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 