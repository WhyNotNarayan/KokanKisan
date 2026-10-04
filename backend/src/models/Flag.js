const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
  flagId: { type: String, required: true, unique: true },
  productId: { type: String, required: true, ref: 'Product' },
  buyerId: { type: String, required: true, ref: 'User' },
  // Community report scale: -5 (harmful) … 0 (neutral) … +5 (outstanding)
  score: { type: Number, min: -5, max: 5 },
  reason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

flagSchema.index({ productId: 1, buyerId: 1 }, { unique: true });

module.exports = mongoose.model('Flag', flagSchema);
