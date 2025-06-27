import React, { useEffect, useState, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, reviewService, ratingService, cartService } from '../../../Data/api';
import { RadioGroup } from "@headlessui/react";
import { Button, Rating, Chip } from "@mui/material";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductDetails = () => {
    const { id } = useParams();
    console.log("ProductDetails component rendered, id:", id);
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching product details for id:', id);
                const [productResponse, reviewsResponse, ratingsResponse] = await Promise.all([
                    productService.getProductById(id),
                    reviewService.getProductReviews(id),
                    ratingService.getProductRatings(id)
                ]);
                console.log('Product response:', productResponse);
                const productData = productResponse.data;
                setProduct(productData);
                setSelectedColor(productData.colors?.[0]);
                setSelectedSize(productData.sizes?.[0]);
                setReviews(reviewsResponse.data || []);
                setRatings(ratingsResponse.data || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError(err.response?.data?.message || 'Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleAddToCart = async () => {
        try {
            if (!selectedColor || !selectedSize) {
                setError('Please select color and size');
                return;
            }

            await cartService.addToCart({
                productId: id,
                quantity: quantity,
                color: selectedColor,
                size: selectedSize,
                price: product.price,
                discountedPrice: typeof product.discountedPrice === 'number' ? product.discountedPrice : product.price
            });
            navigate('/cart');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">{error}</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-semibold">Product not found</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Build image URL from images array
    const imageUrl = (product.images && product.images.length > 0)
        ? `http://localhost:5454${product.images[0]}`
        : 'https://placehold.co/400x400?text=No+Image';

    return (
        <div className="bg-white min-h-screen pt-20 pb-10 px-2 sm:px-6 lg:px-24">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                    <li>
                        <button
                            onClick={() => navigate('/')}
                            className="hover:text-indigo-600 font-medium"
                        >
                            Home
                        </button>
                    </li>
                    <li className="flex items-center">
                        <svg className="mx-2 h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                        </svg>
                        <span className="font-semibold text-gray-900">{product.name}</span>
                    </li>
                </ol>
            </nav>

            {/* Main layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img 
                        src={imageUrl}
                        alt={product.name}
                        className="mx-auto block rounded-lg"
                        style={{ width: 400, height: 400, objectFit: 'contain' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x400?text=No+Image';
                        }}
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <div className="flex items-center space-x-2 mb-4">
                        <p className="text-2xl font-semibold text-gray-800">
                            ${product.discountedPrice ? product.discountedPrice : product.price}
                        </p>
                        {product.discountedPrice && (
                            <>
                                <p className="text-xl line-through opacity-50">${product.price}</p>
                                <p className="text-green-600 font-semibold">
                                    {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% off
                                </p>
                            </>
                        )}
                    </div>
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900">Color</h3>
                            <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2">
                                <div className="flex items-center space-x-3">
                                    {product.colors.map((color) => (
                                        <RadioGroup.Option
                                            key={color}
                                            value={color}
                                            className={({ active, checked }) =>
                                                classNames(
                                                    active && checked ? 'ring ring-offset-1' : '',
                                                    !active && checked ? 'ring-2' : '',
                                                    'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                                                )
                                            }
                                        >
                                            <span
                                                className={`h-8 w-8 rounded-full border border-black border-opacity-10`}
                                                style={{ backgroundColor: color }}
                                            />
                                        </RadioGroup.Option>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900">Size</h3>
                            <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-2">
                                <div className="grid grid-cols-4 gap-2">
                                    {product.sizes.map((size) => (
                                        <RadioGroup.Option
                                            key={size}
                                            value={size}
                                            className={({ active, checked }) =>
                                                classNames(
                                                    active ? 'ring-2 ring-indigo-500 ring-offset-2' : '',
                                                    checked ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700' : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                                                    'flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1'
                                                )
                                            }
                                        >
                                            {size}
                                        </RadioGroup.Option>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    <div className="flex items-center mb-6">
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 text-center border rounded p-2 mr-4"
                        />
                        <button
                            onClick={handleAddToCart}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="text-xs text-gray-400">No reviews yet</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review, i) => (
                            <div key={review._id || i} className="bg-white border rounded p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-indigo-700">
                                        {review.user && (review.user.firstName || review.user.lastName)
                                            ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim()
                                            : 'Anonymous'}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="italic text-gray-700 text-sm">"{review.review}"</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Ratings Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Ratings</h2>
                {ratings.length === 0 ? (
                    <p className="text-xs text-gray-400">No ratings yet</p>
                ) : (
                    <div className="space-y-4">
                        {ratings.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((rating, i) => (
                            <div key={rating._id || i} className="bg-white border rounded p-4 shadow-sm flex items-center gap-2">
                                <Rating value={rating.rating} readOnly size="small" />
                                <span className="font-semibold text-indigo-700 text-xs">
                                    {rating.user && (rating.user.firstName || rating.user.lastName)
                                        ? `${rating.user.firstName || ''} ${rating.user.lastName || ''}`.trim()
                                        : 'Anonymous'}
                                </span>
                                <span className="text-gray-400 text-xs">•</span>
                                <span className="text-gray-500 text-xs">{new Date(rating.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Related Products Section */}
            <section aria-labelledby="related-heading" className="mt-16 border-t border-gray-200 pt-10">
                <h2 id="related-heading" className="text-xl font-bold text-gray-900 mb-6">
                    You may also like
                </h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {product.relatedProducts?.slice(0, 4).map((relatedProduct) => (
                        <HomeSectionCard key={relatedProduct.id} product={relatedProduct} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductDetails;
