const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

// @route  GET /api/admin/stats
// @access Private (admin)
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, totalRestaurants, todayOrders, allOrders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Restaurant.countDocuments({ status: 'active' }),
      Order.find({ createdAt: { $gte: today }, status: { $ne: 'cancelled' } }),
      Order.find({ status: { $ne: 'cancelled' } })
    ]);

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRestaurants,
        todayOrders: todayOrders.length,
        todayRevenue,
        totalRevenue
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/admin/restaurants
// @access Private (admin)
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate('owner', 'firstName email phone');
    res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PATCH /api/admin/restaurants/:id
// @access Private (admin)
const updateRestaurantStatus = async (req, res) => {
  try {
    const { status, commissionPercent } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status, ...(commissionPercent && { commissionPercent }) },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    res.status(200).json({ success: true, message: `Restaurant ${status}!`, data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/admin/users
// @access Private (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PATCH /api/admin/users/:id/ban
// @access Private (admin)
const toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isActive = !user.isActive;
    await user.save();

    const msg = user.isActive ? 'User unbanned.' : 'User banned.';
    res.status(200).json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/admin/orders
// @access Private (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/admin/coupons
// @access Private (admin)
const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created!', data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/admin/coupons
// @access Private (admin)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  DELETE /api/admin/coupons/:id
// @access Private (admin)
const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Coupon deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllRestaurants,
  updateRestaurantStatus,
  getAllUsers,
  toggleUserBan,
  getAllOrders,
  createCoupon,
  getAllCoupons,
  deleteCoupon
};