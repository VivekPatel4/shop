import axios from 'axios';

const API_BASE_URL = 'http://localhost:5454';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    signup: (userData) => api.post('/auth/signup', userData).then(res => res.data),
    signin: (credentials) => api.post('/auth/signin', credentials).then(res => res.data),
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
};

// Product Services
export const productService = {
    getAllProducts: (filters = {}) => {
        const queryParams = new URLSearchParams();
        
        // Handle category ID properly
        if (filters.category) {
            queryParams.append('category', filters.category);
        }
        
        // Add other filters
        if (filters.color) queryParams.append('color', filters.color);
        if (filters.sizes) queryParams.append('sizes', filters.sizes);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.minDiscount) queryParams.append('minDiscount', filters.minDiscount);
        if (filters.sort) queryParams.append('sort', filters.sort);
        if (filters.stock) queryParams.append('stock', filters.stock);
        if (filters.pageNumber) queryParams.append('pageNumber', filters.pageNumber);
        if (filters.pageSize) queryParams.append('pageSize', filters.pageSize);

        return api.get(`/api/products?${queryParams.toString()}`);
    },
    getProductById: (id) => api.get(`/api/products/id/${id}`),
};

// Cart Services
export const cartService = {
    getCart: () => api.get('/api/cart'),
    addToCart: (cartItem) => api.post('/api/cart_items', cartItem),
    updateCartItem: (id, cartItem) => api.put(`/api/cart_items/${id}`, cartItem),
    removeFromCart: (id) => api.delete(`/api/cart_items/${id}`),
};

// Order Services
export const orderService = {
    createOrder: (orderData) => api.post('/api/orders', orderData),
    getOrders: () => api.get('/api/orders'),
    getOrderById: (id) => api.get(`/api/orders/${id}`),
};

// Review Services
export const reviewService = {
    createReview: (reviewData) => api.post('/api/reviews/create', reviewData),
    getProductReviews: (productId) => api.get(`/api/reviews/product/${productId}`),
};

// Rating Services
export const ratingService = {
    createRating: (ratingData) => api.post('/api/ratings/create', ratingData),
    getProductRatings: (productId) => api.get(`/api/ratings/product/${productId}`),
};

// User Services
export const userService = {
    getProfile: () => api.get('/api/users/profile'),
    updateProfile: (data) => api.put('/api/users/profile', data),
    getAddresses: () => api.get('/api/users/addresses'),
    addAddress: (data) => api.post('/api/users/addresses', data),
    updateAddress: (id, data) => api.put(`/api/users/addresses/${id}`, data),
    deleteAddress: (id) => api.delete(`/api/users/addresses/${id}`),
};

// Wishlist Services
export const wishlistService = {
    getWishlist: () => api.get('/api/wishlist'),
    addToWishlist: (productId) => api.post('/api/wishlist/add', { productId }),
    removeFromWishlist: (productId) => api.delete(`/api/wishlist/remove/${productId}`),
};

// Category Services
export const categoryService = {
    getAllCategories: () => api.get('/api/categories'),
};

export default api; 