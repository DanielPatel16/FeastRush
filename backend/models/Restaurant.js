const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  cuisine: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    default: '🍽️'
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  phone: String,
  email: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  deliveryTime: {
    type: String,
    default: '30-40 min'
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  minOrder: {
    type: Number,
    default: 99
  },
  commissionPercent: {
    type: Number,
    default: 18
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'pending'
  },
  businessHours: {
    monday:    { open: { type: String, default: '09:00' }, close: { type: String, default: '23:00' } },
    tuesday:   { open: { type: String, default: '09:00' }, close: { type: String, default: '23:00' } },
    wednesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '23:00' } },
    thursday:  { open: { type: String, default: '09:00' }, close: { type: String, default: '23:00' } },
    friday:    { open: { type: String, default: '09:00' }, close: { type: String, default: '23:00' } },
    saturday:  { open: { type: String, default: '10:00' }, close: { type: String, default: '00:00' } },
    sunday:    { open: { type: String, default: '10:00' }, close: { type: String, default: '22:00' } }
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);