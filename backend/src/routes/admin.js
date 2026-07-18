const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Flag = require('../models/Flag');
const { calculateTrustScore } = require('../utils/trustScore');

const router = express.Router();

router.use(auth, roleCheck('admin'));

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const pendingApprovals = await FarmerProfile.countDocuments({ status: 'pending' });
    const totalFlags = await Flag.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, totalCommission: { $sum: '$commission' } } },
    ]);
    const revenue = revenueAgg.length > 0 ? revenueAgg[0] : { totalRevenue: 0, totalCommission: 0 };

    res.json({
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalProducts,
      totalOrders,
      pendingApprovals,
      totalFlags,
      totalRevenue: revenue.totalRevenue,
      totalCommission: revenue.totalCommission,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

router.get('/farmers/pending', async (req, res) => {
  try {
    const pending = await FarmerProfile.find({ status: 'pending' });
    const uids = pending.map((p) => p.uid);
    const users = await User.find({ uid: { $in: uids } }).select('uid name phone village taluka city createdAt');

    const enriched = users.map((u) => {
      const profile = pending.find((p) => p.uid === u.uid);
      return { ...u.toObject(), profile };
    });

    res.json(enriched);
  } catch (err) {
    console.error('Get pending farmers error:', err);
    res.status(500).json({ error: 'Failed to fetch pending farmers.' });
  }
});

router.put('/farmers/:id/approve', async (req, res) => {
  try {
    const profile = await FarmerProfile.findOneAndUpdate(
      { uid: req.params.id },
      { status: 'approved' },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: 'Farmer profile not found.' });
    }

    await calculateTrustScore(req.params.id);

    res.json({ message: 'Farmer approved.', profile });
  } catch (err) {
    console.error('Approve farmer error:', err);
    res.status(500).json({ error: 'Failed to approve farmer.' });
  }
});

router.put('/farmers/:id/suspend', async (req, res) => {
  try {
    const profile = await FarmerProfile.findOneAndUpdate(
      { uid: req.params.id },
      { status: 'suspended' },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: 'Farmer profile not found.' });
    }

    res.json({ message: 'Farmer suspended.', profile });
  } catch (err) {
    console.error('Suspend farmer error:', err);
    res.status(500).json({ error: 'Failed to suspend farmer.' });
  }
});

router.get('/flags', async (req, res) => {
  try {
    const flags = await Flag.find().sort({ createdAt: -1 }).limit(100);
    res.json(flags);
  } catch (err) {
    console.error('Get flags error:', err);
    res.status(500).json({ error: 'Failed to fetch flags.' });
  }
});

router.put('/products/:id/remove', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.id },
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ message: 'Product removed.', product });
  } catch (err) {
    console.error('Remove product error:', err);
    res.status(500).json({ error: 'Failed to remove product.' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-__v').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

module.exports = router;
