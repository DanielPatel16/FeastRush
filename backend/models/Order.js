const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [
    {
      menuItem:  { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      name:      { type: String, required: true },
      emoji:     { type: String, default: '🍽️' },
      price:     { type: Number, required: true },
      quantity:  { type: Number, required: true, min: 1 }
    }
  ],
  deliveryAddress: {
    name:    String,
    phone:   String,
    address: String,
    city:    String,
    pincode: String
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet', 'cod'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  couponCode:    { type: String, default: null },
  subtotal:      { type: Number, required: true },
  discount:      { type: Number, default: 0 },
  deliveryFee:   { type: Number, default: 0 },
  tax:           { type: Number, default: 0 },
  tip:           { type: Number, default: 0 },
  totalAmount:   { type: Number, required: true },
  commission:    { type: Number, default: 0 },
  ownerEarning:  { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['placed', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'],
    default: 'placed'
  },
  statusHistory: [
    {
      status:    String,
      updatedAt: { type: Date, default: Date.now },
      note:      String
    }
  ],
  cookingInstructions: { type: String, default: '' },
  deliveryType: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },
  estimatedDelivery: { type: String, default: '20-25 min' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);