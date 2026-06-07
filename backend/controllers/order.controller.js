const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Coupon = require('../models/Coupon');
const MenuItem = require('../models/MenuItem');

// @route  POST /api/orders
// @access Private (user)
const placeOrder = async (req, res) => {
  try {
    const {
      restaurantId, items, deliveryAddress,
      paymentMethod, couponCode, tip,
      cookingInstructions, deliveryType
    } = req.body;

    // Calculate subtotal
    let subtotal = 0;
    items.forEach(item => { subtotal += item.price * item.quantity; });

    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round(subtotal * (coupon.discountValue / 100));
        } else {
          discount = coupon.discountValue;
        }
        // Increment usage count
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const afterDiscount = subtotal - discount;
    const tax = Math.round(afterDiscount * 0.05);         // 5% GST
    const deliveryFee = deliveryType === 'pickup' ? 0 : 0; // Free delivery for now
    const tipAmt = tip || 0;
    const totalAmount = afterDiscount + tax + deliveryFee + tipAmt;

    // Calculate commission & owner earning
    const restaurant = await Restaurant.findById(restaurantId);
    const commission = Math.round(totalAmount * (restaurant.commissionPercent / 100));
    const ownerEarning = totalAmount - commission;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      couponCode: couponCode || null,
      subtotal,
      discount,
      deliveryFee,
      tax,
      tip: tipAmt,
      totalAmount,
      commission,
      ownerEarning,
      cookingInstructions,
      deliveryType,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      statusHistory: [{ status: 'placed', note: 'Order placed by customer' }]
    });

    // Increment totalOrders count on each menu item
    for (const item of items) {
      if (item.menuItem) {
        await MenuItem.findByIdAndUpdate(item.menuItem, { $inc: { totalOrders: item.quantity } });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderId: order._id,
      data: order
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/orders/my
// @access Private (user)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name emoji cuisine')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/orders/:id
// @access Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name emoji address phone')
      .populate('user', 'firstName email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/owner/orders
// @access Private (owner)
const getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const { status } = req.query;
    let filter = { restaurant: restaurant._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('user', 'firstName phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PATCH /api/orders/:id/status
// @access Private (owner)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const validStatuses = ['accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: {
          statusHistory: { status, note: note || '', updatedAt: new Date() }
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, message: `Order ${status}!`, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/owner/stats
// @access Private (owner)
const getOwnerStats = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Not found.' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({
      restaurant: restaurant._id,
      createdAt: { $gte: today },
      status: { $ne: 'cancelled' }
    });

    const totalRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = todayOrders.length;

    res.status(200).json({
      success: true,
      data: {
        todayRevenue: totalRevenue,
        todayOrders: totalOrders,
        rating: restaurant.rating,
        isOpen: restaurant.isOpen
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  getOwnerStats
};