const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  placeOrder, getMyOrders, getOrderById,
  getRestaurantOrders, updateOrderStatus, getOwnerStats
} = require('../controllers/order.controller');

// User
router.post('/',         protect, authorize('user'), placeOrder);
router.get('/my',        protect, authorize('user'), getMyOrders);
router.get('/:id',       protect, getOrderById);

// Owner
router.get('/owner/all',       protect, authorize('owner'), getRestaurantOrders);
router.get('/owner/stats',     protect, authorize('owner'), getOwnerStats);
router.patch('/:id/status',    protect, authorize('owner'), updateOrderStatus);

module.exports = router;