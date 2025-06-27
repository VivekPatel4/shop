import React, { useEffect, useState } from "react";
import ProductCard from "../components/Product/ProductCard";
import { useNavigate } from "react-router-dom";
import { wishlistService } from "../../Data/api";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    wishlistService.getWishlist()
      .then(res => setWishlist(res.data))
      .catch(() => setWishlist([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    await wishlistService.removeFromWishlist(productId);
    setWishlist(wishlist.filter(item => item._id !== productId));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-4">No items in your wishlist.</p>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition font-medium"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard product={product} />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1 text-xs shadow hover:bg-red-600"
                onClick={() => handleRemove(product._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 