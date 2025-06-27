import React, { useEffect, useState } from "react";
import MainCarousel from "../../components/homecarousel/MainCarousel";
import HomeSectionCarousel from "../../components/HomeSectionCarousel/HomeSectionCarousel";
import HomeSectionCard from "../../components/HomeSectionCard/HomeSectionCard";
import { productService, categoryService, reviewService, ratingService } from "../../../Data/api";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({}); // { categoryId: [products] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const catRes = await categoryService.getAllCategories();
        const cats = catRes.data;
        setCategories(cats);
        // Fetch products for each category
        const productsByCategory = {};
        const firstProducts = [];
        await Promise.all(
          cats.map(async (cat) => {
            try {
              const prodRes = await productService.getAllProducts({ category: cat._id });
              const products = prodRes.data?.content || [];
              productsByCategory[cat._id] = products;
              if (products.length > 0) {
                firstProducts.push({
                  productId: products[0]._id || products[0].id,
                  productName: products[0].name
                });
              }
            } catch {
              productsByCategory[cat._id] = [];
            }
          })
        );
        setCategoryProducts(productsByCategory);
        setError(null);
        // Fetch reviews and ratings for the first product in each category
        let allReviews = [];
        await Promise.all(
          firstProducts.map(async (prod) => {
            try {
              const [reviewRes, ratingRes] = await Promise.all([
                reviewService.getProductReviews(prod.productId),
                ratingService.getProductRatings(prod.productId)
              ]);
              const ratings = ratingRes.data || [];
              // Map userId to rating for quick lookup
              const userRatingMap = {};
              ratings.forEach(r => {
                userRatingMap[r.user] = r.rating;
              });
              // Attach rating to each review if available
              const reviewsWithProduct = (reviewRes.data || []).map(r => ({
                ...r,
                productName: prod.productName,
                rating: userRatingMap[r.user?._id || r.user] || 0
              }));
              allReviews = allReviews.concat(reviewsWithProduct);
            } catch {
              // skip
            }
          })
        );
        setReviews(allReviews);
      } catch (err) {
        setError("Failed to load categories or products");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesAndProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <MainCarousel />

      {/* Categories and their Products (no Shop by Category heading) */}
      <div className="py-10 px-5 lg:px-10">
        {loading ? (
          <div className="text-center py-10">Loading categories and products...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="mb-12">
              <HomeSectionCarousel
                data={categoryProducts[cat._id] || []}
                sectionName={cat.name}
              />
            </div>
          ))
        )}
      </div>

      {/* Testimonials (Reviews) */}
      <section className="bg-white py-10 px-5 lg:px-10 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">What Our Customers Say</h2>
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500">No reviews yet.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {reviews.map((r, idx) => (
              <div key={idx} className="max-w-xs bg-gray-100 rounded-lg shadow p-6">
                <div className="flex items-center mb-2">
                  {/* Star rating */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < (r.rating || 0) ? "text-yellow-400" : "text-gray-300"}>&#9733;</span>
                  ))}
                </div>
                <p className="italic mb-4">"{r.review}"</p>
                <p className="font-semibold text-right">- {r.user?.name || r.user?.firstName || "Customer"}</p>
                {r.productName && <p className="text-xs text-gray-500 text-right mt-1">on {r.productName}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-10">
        <p>&copy; {new Date().getFullYear()} Shop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;