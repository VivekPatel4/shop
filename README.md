
🛒 Shop - E-commerce Platform
This repository contains a full-stack e-commerce platform with separate applications for Admin, Customer, and Backend services. The project is designed for scalability, maintainability, and a modern user experience.
Features
🛍️ Customer App
-Browse products with categories and filters
-Product details with reviews and ratings
-Shopping cart and wishlist management
-Secure user authentication (Sign Up, Sign In)
-Checkout process with delivery address and order summary
-Order tracking and order history
-Responsive design for all devices
🛠️ Admin App
-Admin dashboard with analytics
-Manage products, categories, and customers
-Order management and status updates
-Admin authentication and protected routes
-Notifications and profile management
⚙️ Backend (Node.js/Express)
-RESTful API for all e-commerce operations
-JWT-based authentication and authorization
-MongoDB database integration
-File upload support for product images
-Modular controllers, services, and models
-Middleware for authentication and error handling
Tech Stack
-Frontend (Admin & Customer): React, TypeScript (Admin), JavaScript (Customer), Tailwind CSS, Vite
-Backend: Node.js, Express.js, MongoDB, JWT
-Other: REST API, Context API, Custom Hooks

Project Structure
shop/
  ├── admin/      # Admin dashboard (React + TypeScript)
  ├── customer/   # Customer-facing app (React)
  └── backend/    # Node.js/Express API server
