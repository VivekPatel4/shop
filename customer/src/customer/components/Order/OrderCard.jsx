import { Grid } from "@mui/material";
import React from "react";
import AdjustIcon from '@mui/icons-material/Adjust';
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/account/order/${order._id}`)}
      className="mt-20 p-0 rounded-xl shadow-lg border border-gray-200 bg-white hover:shadow-2xl transition cursor-pointer max-w-4xl mx-auto"
      style={{ overflow: 'hidden' }}
    >
      <div className="px-8 pt-6 pb-2">
        <div className="flex flex-col gap-6">
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((orderItem, idx) => {
              const product = orderItem.product;
              return (
                <div
                  key={orderItem._id || idx}
                  className={`flex items-center gap-6 py-4 ${idx !== order.orderItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <img
                    className="w-20 h-20 object-cover object-top rounded-lg border border-gray-100 bg-gray-50"
                    src={product?.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/80"}
                    alt={product?.name || "Product"}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg truncate text-gray-900">{product?.name || "Product Name"}</div>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                      <span>Size: <span className="font-medium text-gray-800">{orderItem?.size || "-"}</span></span>
                      <span>
                        Color: <span className="font-medium text-gray-800">
                          {product?.colors && product.colors.length > 0 ? product.colors.join(", ") : "-"}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-blue-700">${orderItem?.price || "-"}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500">No products found in this order.</div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center px-8 py-4 bg-gray-50 border-t border-gray-100">
        <div>
          <span className="text-gray-500 text-sm">Order Status:</span>
          <span className={`ml-2 font-semibold text-base ${
            order.orderStatus === 'PLACED'
              ? 'text-yellow-600'
              : order.orderStatus === 'DELIVERED'
              ? 'text-green-600'
              : order.orderStatus === 'CANCELLED'
              ? 'text-red-600'
              : 'text-gray-700'
          }`}>
            {order.orderStatus}
          </span>
          {order.orderStatus === "DELIVERED" && (
            <span className="ml-4 flex items-center text-green-600 text-sm">
              <AdjustIcon sx={{ width: "16px", height: "16px" }} className="mr-1" />
              Delivered on {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "-"}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-gray-500 text-sm mr-2">Total:</span>
          <span className="text-2xl font-bold text-blue-700">${order.totalPrice || "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
