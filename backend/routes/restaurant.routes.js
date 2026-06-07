const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getAllRestaurants, getRestaurantById, getRestaurantMenu,
  addMenuItem, updateMenuItem, deleteMenuItem,
  getMyRestaurant, updateMyRestaurant
} = require('../controllers/restaurant.controller');

// Public
router.get('/',           getAllRestaurants);
router.get('/:id',        getRestaurantById);
router.get('/:id/menu',   getRestaurantMenu);

// Owner only
router.get('/owner/me',         protect, authorize('owner'), getMyRestaurant);
router.put('/owner/me',         protect, authorize('owner'), updateMyRestaurant);
router.post('/owner/menu',      protect, authorize('owner'), addMenuItem);
router.put('/owner/menu/:id',   protect, authorize('owner'), updateMenuItem);
router.delete('/owner/menu/:id',protect, authorize('owner'), deleteMenuItem);

module.exports = router;