const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  farmerId: { type: String, required: true, ref: 'FarmerProfile' },
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Rice & Grains',
      'Vegetables',
      'Fruits',
      'Spices',
      'Coconut Products',
      'Fish & Seafood',
      'Pickles & Homemade',
      'Other',
    ],
  },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'kg' },
  description: { type: String, default: '' },
  images: [{ type: String }],
  village: { type: String, required: true },
  taluka: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  flagCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

productSchema.index({ taluka: 1, category: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
