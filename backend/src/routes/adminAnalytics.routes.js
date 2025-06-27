const express = require('express');
const router = express.Router();
const adminAnalyticsController = require('../controller/adminAnalytics.controller');

router.get('/summary', adminAnalyticsController.getSummary);
router.get('/sales', adminAnalyticsController.getSales);
router.get('/visits', adminAnalyticsController.getVisits);
router.get('/top-products', adminAnalyticsController.getTopProducts);

module.exports = router; 