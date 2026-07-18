const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true, ref: 'Order' },
  buyerId: { type: String, required: true, ref: 'User' },
  farmerId: { type: String, required: true, ref: 'FarmerProfile' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
