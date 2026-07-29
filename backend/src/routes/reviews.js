const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Review = require('../models/Review');
const Order = require('../models/Order');
const { generateId } = require('../utils/helpers');
const { calculateTrustScore } = require('../utils/trustScore');

const router = express.Router();

router.post('/', auth, roleCheck('buyer'), async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating) {
      return res.status(400).json({ error: 'Order ID and rating are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    if (order.buyerId !== req.uid) {
      return res.status(403).json({ error: 'Not authorized.' });
    }
    if (order.status !== 'Delivered') {
      return res.status(400).json({ error: 'Can only review delivered orders.' });
    }

    const existing = await Review.findOne({ orderId });
    if (existing) {
      return res.status(400).json({ error: 'Already reviewed this order.' });
    }

    const review = await Review.create({
      reviewId: generateId(),
      orderId,
      buyerId: req.uid,
      farmerId: order.farmerId,
      rating: Number(rating),
      comment: comment || '',
    });

    await calculateTrustScore(order.farmerId);

    res.status(201).json(review);
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Failed to create review.' });
  }
});

router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const reviews = await Review.find({ farmerId: req.params.farmerId })
      .sort({ createdAt: -1 })
      .limit(50);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, count: reviews.length });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

module.exports = router;
