const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Product = require('../models/Product');
const Flag = require('../models/Flag');
const { generateId } = require('../utils/helpers');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { taluka, category, search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (taluka) filter.taluka = taluka;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

router.post('/', auth, roleCheck('farmer'), async (req, res) => {
  try {
    const { name, category, price, quantity, unit, description, images, village, taluka } = req.body;

    if (!name || !category || !price || !quantity || !village || !taluka) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const product = await Product.create({
      productId: generateId(),
      farmerId: req.uid,
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
      unit: unit || 'kg',
      description: description || '',
      images: images || [],
      village,
      taluka,
      inStock: true,
      isActive: true,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

router.put('/:id', auth, roleCheck('farmer'), async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    if (product.farmerId !== req.uid) {
      return res.status(403).json({ error: 'Not authorized to edit this product.' });
    }

    const updates = req.body;
    delete updates.productId;
    delete updates.farmerId;
    delete updates.flagCount;

    const updated = await Product.findOneAndUpdate(
      { productId: req.params.id },
      updates,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

router.delete('/:id', auth, roleCheck('farmer', 'admin'), async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    if (product.farmerId !== req.uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    await Product.findOneAndDelete({ productId: req.params.id });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

router.put('/:id/stock', auth, roleCheck('farmer'), async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    if (product.farmerId !== req.uid) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    product.inStock = !product.inStock;
    await product.save();

    res.json({ message: `Product marked as ${product.inStock ? 'In Stock' : 'Out of Stock'}`, product });
  } catch (err) {
    console.error('Stock toggle error:', err);
    res.status(500).json({ error: 'Failed to toggle stock.' });
  }
});

router.post('/:id/flag', auth, roleCheck('buyer'), async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Reason is required to flag a product.' });
    }

    const existing = await Flag.findOne({ productId: req.params.id, buyerId: req.uid });
    if (existing) {
      return res.status(400).json({ error: 'You have already flagged this product.' });
    }

    await Flag.create({
      flagId: generateId(),
      productId: req.params.id,
      buyerId: req.uid,
      reason,
    });

    const product = await Product.findOne({ productId: req.params.id });
    if (product) {
      product.flagCount = (product.flagCount || 0) + 1;
      if (product.flagCount >= 3) {
        product.isActive = false;
      }
      await product.save();
    }

    res.json({ message: 'Product flagged successfully.' });
  } catch (err) {
    console.error('Flag product error:', err);
    res.status(500).json({ error: 'Failed to flag product.' });
  }
});

module.exports = router;
