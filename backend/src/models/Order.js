const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  buyerId: { type: String, required: true, ref: 'User' },
  farmerId: { type: String, required: true, ref: 'FarmerProfile' },
  productId: { type: String, required: true, ref: 'Product' },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  farmerPayout: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Confirmed',
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'st_bus', 'courier', 'community'],
    default: 'pickup',
  },
  deliveryAddress: { type: String, default: '' },
  paymentId: { type: String, default: '' },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
