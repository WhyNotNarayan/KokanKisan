const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Blog = require('../models/Blog');
const Product = require('../models/Product');
const FarmerProfile = require('../models/FarmerProfile');
const { generateId } = require('../utils/helpers');

const router = express.Router();

function verifyInventory(ingredientTags) {
  return Promise.all(
    ingredientTags.map(async (tag) => {
      const regex = new RegExp(tag, 'i');
      const product = await Product.findOne({
        isActive: true,
        inStock: true,
        $or: [{ name: regex }, { category: regex }, { description: regex }],
      }).populate('farmerId', 'uid');

      if (product) {
        return {
          ingredient: tag,
          available: true,
          farmerId: product.farmerId,
          productId: product.productId,
        };
      }
      return { ingredient: tag, available: false, farmerId: null, productId: null };
    })
  );
}

router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs.' });
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogId: req.params.id });
    if (!blog) return res.status(404).json({ error: 'Blog not found.' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog.' });
  }
});

router.use(auth, roleCheck('admin'));

router.get('/admin/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs.' });
  }
});

router.post('/blogs', async (req, res) => {
  try {
    const { title, festival, festivalDate, sections, ingredientTags, images, videoUrls, status } = req.body;
    const blogId = generateId();

    let inventoryStatus = [];
    if (ingredientTags && ingredientTags.length) {
      inventoryStatus = await verifyInventory(ingredientTags);
    }

    const blog = await Blog.create({
      blogId,
      title,
      festival,
      festivalDate,
      sections: sections || {},
      ingredientTags: ingredientTags || [],
      images: images || [],
      videoUrls: videoUrls || [],
      inventoryStatus,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null,
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ error: 'Failed to create blog.' });
  }
});

router.put('/blogs/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.body.ingredientTags) {
      update.inventoryStatus = await verifyInventory(req.body.ingredientTags);
    }
    if (req.body.status === 'published') {
      update.publishedAt = new Date();
    }
    const blog = await Blog.findOneAndUpdate({ blogId: req.params.id }, update, { new: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found.' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog.' });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findOneAndDelete({ blogId: req.params.id });
    res.json({ message: 'Blog deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog.' });
  }
});

router.get('/inventory-check/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogId: req.params.id });
    if (!blog) return res.status(404).json({ error: 'Blog not found.' });
    const inventoryStatus = await verifyInventory(blog.ingredientTags);
    blog.inventoryStatus = inventoryStatus;
    await blog.save();
    res.json(inventoryStatus);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify inventory.' });
  }
});

module.exports = router;
