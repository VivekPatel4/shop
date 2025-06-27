const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

// 1. Summary
exports.getSummary = async (req, res) => {
  const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
  const totalOrders = await Order.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
  const totalProducts = await Product.countDocuments();
  res.json({
    revenue: totalRevenue[0]?.total || 0,
    orders: totalOrders,
    customers: totalCustomers,
    products: totalProducts,
  });
};

// 2. Sales by month (for current year)
exports.getSales = async (req, res) => {
  const year = new Date().getFullYear();
  const sales = await Order.aggregate([
    { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
    { $group: {
      _id: { $month: '$createdAt' },
      total: { $sum: '$totalPrice' }
    }},
    { $sort: { '_id': 1 } }
  ]);
  // Format for chart
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const salesData = months.map((name, idx) => ({
    name,
    total: sales.find(s => s._id === idx + 1)?.total || 0
  }));
  res.json(salesData);
};

// 3. Visits (dummy data unless you track visits)
exports.getVisits = async (req, res) => {
  // Replace with real analytics if available
  res.json([
    { name: 'Mon', visits: 100 },
    { name: 'Tue', visits: 120 },
    { name: 'Wed', visits: 90 },
    { name: 'Thu', visits: 110 },
    { name: 'Fri', visits: 130 },
    { name: 'Sat', visits: 150 },
    { name: 'Sun', visits: 80 },
  ]);
};

// 4. Top products by sales
exports.getTopProducts = async (req, res) => {
  const topProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    { $group: {
      _id: '$orderItems.product',
      sales: { $sum: '$orderItems.quantity' }
    }},
    { $sort: { sales: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    { $project: { name: '$product.name', sales: 1 } }
  ]);
  res.json(topProducts);
}; 