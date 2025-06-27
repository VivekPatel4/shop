import React, { useEffect, useState } from "react";
import AddressCard from "../AddressCard/AddressCard";
import OrderTraker from "./OrderTraker";
import { Box, Grid, Modal, Typography, TextField, Button } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useParams } from "react-router-dom";
import { orderService, reviewService, ratingService } from "../../../Data/api";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import Rating from '@mui/material/Rating';

const statusStepMap = {
  "PLACED": 0,
  "ORDER_CONFIRMED": 1,
  "SHIPPED": 2,
  "OUT_FOR_DELIVERY": 3,
  "DELIVERED": 4
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [productReviews, setProductReviews] = useState({});
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order && order.orderItems) {
      order.orderItems.forEach(async (orderItem) => {
        const productId = orderItem.product._id;
        try {
          const [reviewsRes, ratingsRes] = await Promise.all([
            reviewService.getProductReviews(productId),
            ratingService.getProductRatings(productId)
          ]);
          setProductReviews(prev => ({ ...prev, [productId]: reviewsRes.data }));
          setProductRatings(prev => ({ ...prev, [productId]: ratingsRes.data }));
        } catch (e) {}
      });
    }
  }, [order]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh] text-lg">Loading order details...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-[40vh] text-red-500">{error}</div>;
  }
  if (!order) {
    return null;
  }

  const address = order.shippingAddress || {};
  const activeStep = statusStepMap[order.orderStatus?.toUpperCase()] ?? 0;

  const handleOpenModal = (product) => {
    setModalProduct(product);
    setModalOpen(true);
    setRating(0);
    setReview('');
    setSuccessMsg('');
    setErrorMsg('');
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalProduct(null);
    setSuccessMsg('');
    setErrorMsg('');
  };
  const handleSubmitReview = async () => {
    if (!rating || !review.trim()) {
      setErrorMsg('Please provide both a rating and a review.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      await ratingService.createRating({ productId: modalProduct._id, rating });
      await reviewService.createReview({ productId: modalProduct._id, review });
      setSuccessMsg('Thank you for your feedback!');
      setTimeout(() => {
        handleCloseModal();
      }, 1200);
    } catch (err) {
      setErrorMsg('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 md:px-20 py-8">
      {order.orderStatus === "CANCELLED" && (
        <div className="flex justify-center w-full">
          <div className="mt-6 mb-8 w-full max-w-3xl p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center text-lg font-semibold shadow">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
              </svg>
              This order has been <b>cancelled.</b>
            </span>
          </div>
        </div>
      )}
      <div className="mb-8">
        <h1 className="font-bold text-xl py-4">Delivery Address</h1>
        <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 max-w-xl">
          {address && address.firstName ? (
            <>
              <div className="flex items-center gap-2 text-gray-700">
                <PersonIcon className="text-blue-600" />
                <span className="font-semibold text-base">{address.firstName} {address.lastName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <LocationOnIcon className="text-green-600" />
                <span>{address.streetAddress}, {address.city}, {address.state}, {address.zipCode}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <PhoneIcon className="text-purple-600" />
                <span>{address.mobile}</span>
              </div>
            </>
          ) : (
            <div className="text-gray-500">No delivery address found for this order.</div>
          )}
        </div>
      </div>
      {order.orderStatus !== "CANCELLED" && (
        <div className="py-10">
          <OrderTraker activeStep={activeStep} />
        </div>
      )}
      <Grid className="space-y-5" container>
        {order.orderItems && order.orderItems.length > 0 ? (
          order.orderItems.map((orderItem, idx) => {
            const product = orderItem.product;
            const canReview = order.orderStatus === 'DELIVERED' && order.orderStatus !== 'CANCELLED';
            return (
              <Grid
                key={orderItem._id || idx}
                item
                container
                className={`shadow-xl rounded-md p-5 border mb-6 ${order.orderStatus === "CANCELLED" ? "bg-gray-100 opacity-70" : "bg-white"}`}
                sx={{ alignItems: "center", justifyContent: "space-between" }}
              >
                <Grid item xs={6}>
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-[5rem] h-[5rem] object-cover object-top rounded"
                      src={product?.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/80"}
                      alt={product?.name || "Product"}
                    />
                    <div className="space-y-2 ml-5">
                      <p className="font-semibold text-lg">{product?.name || "Product Name"}</p>
                      <p className="space-x-5 opacity-50 text-base font-semibold">
                        <span>
                          Color: {product?.colors && product.colors.length > 0 ? product.colors.join(", ") : "-"}
                        </span>
                        <span>Size: {orderItem?.size || "-"}</span>
                      </p>
                      <p>Seller: zippping collation</p>
                      <p className="text-blue-700 font-bold text-lg">${orderItem?.price || "-"}</p>
                    </div>
                  </div>
                </Grid>
                <Grid item>
                  <Box sx={{ color: deepPurple[500] }}>
                    <StarBorderIcon sx={{ fontSize: "2rem" }} className="px-2" />
                    {canReview ? (
                      <span
                        className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                        onClick={() => handleOpenModal(product)}
                      >
                        Rate & Review Product
                      </span>
                    ) : (
                      <span className="text-gray-400 font-semibold cursor-not-allowed">Rate & Review Product</span>
                    )}
                  </Box>
                </Grid>
                {/* Ratings & Reviews Section */}
                <div className="mt-4">
                  {/* Reviews */}
                  <div>
                    <div className="font-semibold text-sm text-gray-700 mb-1">Reviews</div>
                    {(productReviews[product._id] || []).length === 0 ? (
                      <div className="text-xs text-gray-400">No reviews yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {(productReviews[product._id] || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((r, i) => (
                          <div key={r._id || i} className="bg-white border rounded p-3 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-indigo-700">
                                {r.user && (r.user.firstName || r.user.lastName)
                                  ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim()
                                  : 'Anonymous'}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="italic text-gray-700 text-sm">"{r.review}"</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Ratings */}
                  <div className="mt-4">
                    <div className="font-semibold text-sm text-gray-700 mb-1">Ratings</div>
                    {(productRatings[product._id] || []).length === 0 ? (
                      <div className="text-xs text-gray-400">No ratings yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {(productRatings[product._id] || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((r, i) => (
                          <div key={r._id || i} className="bg-white border rounded p-3 shadow-sm flex items-center gap-2">
                            <Rating value={r.rating} readOnly size="small" />
                            <span className="font-semibold text-indigo-700 text-xs">
                              {r.user && (r.user.firstName || r.user.lastName)
                                ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim()
                                : 'Anonymous'}
                            </span>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Grid>
            );
          })
        ) : (
          <div className="text-gray-500">No products found in this order.</div>
        )}
      </Grid>
      {/* Modal for Rate & Review */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" align="center">Rate & Review Product</Typography>
          {modalProduct && (
            <Typography align="center" fontWeight={600}>{modalProduct.name}</Typography>
          )}
          <Rating
            name="product-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
          />
          <TextField
            label="Your Review"
            multiline
            minRows={3}
            value={review}
            onChange={e => setReview(e.target.value)}
            fullWidth
          />
          {errorMsg && <Typography color="error" align="center">{errorMsg}</Typography>}
          {successMsg && <Typography color="success.main" align="center">{successMsg}</Typography>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitReview}
            disabled={submitting}
            sx={{ mt: 1 }}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
          <Button onClick={handleCloseModal} color="secondary" sx={{ mt: 1 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default OrderDetails;
