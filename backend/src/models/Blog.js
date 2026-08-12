const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogId: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  festival: { type: String, required: true, trim: true },
  festivalDate: { type: Date },
  sections: {
    whatIs: { type: String, default: '' },
    whyTraditionalFood: { type: String, default: '' },
    whyHealthy: { type: String, default: '' },
    ingredients: { type: String, default: '' },
  },
  ingredientTags: [{ type: String }],
  images: [{ type: String }],
  videoUrls: [{ type: String }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  inventoryStatus: [
    {
      ingredient: String,
      available: Boolean,
      farmerId: String,
      productId: String,
    },
  ],
  publishedAt: { type: Date },
  reusedFrom: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', blogSchema);
