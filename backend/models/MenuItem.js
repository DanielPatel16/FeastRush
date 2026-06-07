const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  emoji: {
    type: String,
    default: '🍽️'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    enum: ['Starters', 'Pizzas', 'Pastas', 'Sides', 'Drinks', 'Desserts', 'Main Course', 'Other'],
    default: 'Other'
  },
  type: {
    type: String,
    enum: ['veg', 'nonveg'],
    required: true
  },
  tags: {
    isBestseller: { type: Boolean, default: false },
    isSpicy:      { type: Boolean, default: false },
    isNew:        { type: Boolean, default: false }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  totalOrders: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);