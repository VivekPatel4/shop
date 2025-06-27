import React from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { wishlistService } from "../../../Data/api";

const ProductCard = ({product}) => {
  const navigate = useNavigate();
  
  // Build image URL from images array
  const imageUrl = (product.images && product.images.length > 0)
    ? `http://localhost:5454${product.images[0]}`
    : 'https://placehold.co/200x300?text=No+Image';

  const handleClick = () => {
    if (product && (product.id || product._id)) {
      navigate(`/product/${product.id || product._id}`);
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    try {
      await wishlistService.addToWishlist(product._id);
      alert("Added to wishlist!");
    } catch {
      alert("Failed to add to wishlist.");
    }
  };

  return (
    <div onClick={handleClick} className="productCard w-[13rem] m-3 transition-all cursor-pointer">
      <div className="h-[18rem]">
        <img 
          className="h-full w-full object-cover object-left-top"
          src={imageUrl}
          alt={product?.name || 'Product image'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/200x300?text=No+Image';
          }}
        />
      </div>

      <div className="textPart bg-white p-3">
        <div>
          <p className="font-bold opacity-60">{product?.brand || 'Brand'}</p>
          <p>{product?.name || 'Product Title'}</p>
        </div> 
        <div className="flex items-center space-x-2">
          <p className="font-semibold">${product?.discountedPrice || product?.price || '0'}</p>
          {product?.discountedPrice && (
            <>
              <p className="line-through opacity-50">${product?.price}</p>
              <p className="text-green-600 font-semibold">
                {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% off
              </p>
            </>
          )}
        </div>
        <button
          className="mt-2 bg-pink-500 text-white px-3 py-1 rounded text-xs hover:bg-pink-600 transition"
          onClick={handleAddToWishlist}
        >
          Add to Wishlist
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
