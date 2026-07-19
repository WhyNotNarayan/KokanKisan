const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Order = require('../models/Order');
const Product = require('../models/Product');
const FarmerProfile = require('../models/FarmerProfile');
const { generateId, calculateCommission, calculateFarmerPayout } = require('../utils/helpers');

const router = express.Router();

router.post('/', auth, roleCheck('buyer'), async (req, res) => {
  try {
    const { productId, quantity, deliveryMethod, deliveryAddress } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required.' });
    }

    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (!product.inStock || product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock.' });
    }

    const totalAmount = product.price * quantity;
    const commission = calculateCommission(totalAmount);
    const farmerPayout = calculateFarmerPayout(totalAmount, commission);

    const order = await Order.create({
      orderId: generateId(),
      buyerId: req.uid,
      farmerId: product.farmerId,
      productId,
      productName: product.name,
      quantity: Number(quantity),
      pricePerUnit: product.price,
      totalAmount,
      commission,
      farmerPayout,
      deliveryMethod: deliveryMethod || 'pickup',
      deliveryAddress: deliveryAddress || '',
      status: 'Confirmed',
      paymentStatus: 'completed',
    });

    product.quantity -= Number(quantity);
    if (product.quantity <= 0) {
      product.inStock = false;
    }
    await product.save();

    await FarmerProfile.findOneAndUpdate(
      { uid: product.farmerId },
      { $inc: { totalSales: 1, totalEarnings: farmerPayout } }
    );

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (req.user.role === 'buyer' && order.buyerId !== req.uid) {
      return res.status(403).json({ error: 'Not authorized.' });
    }
    if (req.user.role === 'farmer' && order.farmerId !== req.uid) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

router.put('/:id/status', auth, roleCheck('farmer'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    if (order.farmerId !== req.uid) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

router.get('/buyer/:buyerId', auth, async (req, res) => {
  try {
    if (req.user.role === 'buyer' && req.uid !== req.params.buyerId) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const orders = await Order.find({ buyerId: req.params.buyerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get buyer orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

router.get('/farmer/:farmerId', auth, roleCheck('farmer', 'admin'), async (req, res) => {
  try {
    if (req.user.role === 'farmer' && req.uid !== req.params.farmerId) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const orders = await Order.find({ farmerId: req.params.farmerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get farmer orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

module.exports = router;
