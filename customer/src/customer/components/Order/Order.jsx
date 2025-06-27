import { Label } from "@headlessui/react";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { orderService } from "../../../Data/api";
import OrderCard from "./OrderCard";

const orderStatus = [
  { label: "Placed", value: "PLACED" },
  { label: "Order Confirmed", value: "ORDER_CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Returned", value: "RETURNED" },
];

const Order =()=>{
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderService.getOrders();
                // Sort orders by createdAt descending (newest first)
                const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (err) {
                setError("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Filter orders based on selected statuses
    const filteredOrders = selectedStatuses.length === 0
      ? orders
      : orders.filter(order =>
          selectedStatuses.includes(order.orderStatus?.toUpperCase())
        );

    return(
        <div className="px-5 lg:px-20">
            <Grid container sx={{justifyContent:"space-between"}}>
                <Grid item xs={2.5}>
                    <div className="h-auto shadow-lg bg-white p-5 mt-12 rounded-xl">
                        <h1 className="font-bold text-lg">Filter</h1>
                        <div className="space-y-4 mt-10">
                            <h1 className="font-semibold">Order status</h1>
                           {orderStatus.map((option) => (
                            <div className="flex items-center" key={option.value}>
                                <input
                                  id={option.value}
                                  type="checkbox"
                                  checked={selectedStatuses.includes(option.value)}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setSelectedStatuses([...selectedStatuses, option.value]);
                                    } else {
                                      setSelectedStatuses(selectedStatuses.filter(s => s !== option.value));
                                    }
                                  }}
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label className="ml-3 text-sm text-gray-600 " htmlFor={option.value}>
                                    {option.label}
                                </label>
                            </div>
                           ))}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={9}>
                    <div className="space-y-5">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></span>
                                <span className="text-gray-500 text-lg">Loading orders...</span>
                            </div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <svg className="w-16 h-16 text-indigo-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1a2 2 0 002 2h1m10 0h1a2 2 0 002-2V3m-1 4v13a2 2 0 01-2 2H7a2 2 0 01-2-2V7m12 0H5m0 0V5a2 2 0 012-2h10a2 2 0 012 2v2"></path>
                                </svg>
                                <span className="text-xl text-gray-400 font-semibold mb-2">No orders found</span>
                                <a href="/" className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium">Start Shopping</a>
                            </div>
                        ) : (
                            filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
                        )}
                    </div>                                        
                </Grid>
            </Grid>            
        </div>
    )
}

export default Order;
