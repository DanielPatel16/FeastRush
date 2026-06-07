const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getDashboardStats, getAllRestaurants, updateRestaurantStatus,
  getAllUsers, toggleUserBan, getAllOrders,
  createCoupon, getAllCoupons, deleteCoupon
} = require('../controllers/admin.controller');

// All admin routes are protected
router.use(protect, authorize('admin'));

router.get('/stats',                  getDashboardStats);
router.get('/restaurants',            getAllRestaurants);
router.patch('/restaurants/:id',      updateRestaurantStatus);
router.get('/users',                  getAllUsers);
router.patch('/users/:id/ban',        toggleUserBan);
router.get('/orders',                 getAllOrders);
router.post('/coupons',               createCoupon);
router.get('/coupons',                getAllCoupons);
router.delete('/coupons/:id',         deleteCoupon);

module.exports = router;