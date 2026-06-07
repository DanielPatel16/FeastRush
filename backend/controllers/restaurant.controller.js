const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @route  GET /api/restaurants
// @access Public
const getAllRestaurants = async (req, res) => {
  try {
    const { cuisine, rating, search } = req.query;

    let filter = { status: 'active' };

    if (cuisine && cuisine !== 'All') {
      filter.cuisine = { $regex: cuisine, $options: 'i' };
    }

    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }

    const restaurants = await Restaurant.find(filter).select('-businessHours');

    res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/restaurants/:id
// @access Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/restaurants/:id/menu
// @access Public
const getRestaurantMenu = async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurant: req.params.id,
      isAvailable: true
    });

    // Group items by category
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    res.status(200).json({ success: true, data: grouped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/owner/menu
// @access Private (owner only)
const addMenuItem = async (req, res) => {
  try {
    // Find owner's restaurant
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const item = await MenuItem.create({
      restaurant: restaurant._id,
      ...req.body
    });

    res.status(201).json({ success: true, message: 'Menu item added!', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PUT /api/owner/menu/:id
// @access Private (owner only)
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    res.status(200).json({ success: true, message: 'Item updated!', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  DELETE /api/owner/menu/:id
// @access Private (owner only)
const deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Item deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/owner/restaurant
// @access Private (owner only)
const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'No restaurant found.' });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PUT /api/owner/restaurant
// @access Private (owner only)
const updateMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user.id },
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Restaurant updated!', data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMyRestaurant,
  updateMyRestaurant
};