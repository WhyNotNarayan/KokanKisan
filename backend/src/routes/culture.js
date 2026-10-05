const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Blog = require('../models/Blog');
const { generateId } = require('../utils/helpers');
const { saveImages, removeImages, removeImage } = require('../utils/media');
const { verifyInventory } = require('../utils/inventory');

const router = express.Router();

const inventoryKey = (arr) =>
  JSON.stringify(
    (Array.isArray(arr) ? arr : []).map((i) => ({
      ingredient: i.ingredient,
      available: !!i.available,
      farmerId: i.farmerId || null,
      productId: i.productId || null,
    }))
  );

// Every public blog read recomputes availability from live products and writes
// the result back, so a stale inventoryStatus can never be shown to buyers.
async function refreshInventory(blog) {
  const ingredients = blog.ingredientTags?.length
    ? blog.ingredientTags
    : (blog.inventoryStatus || []).map((i) => i.ingredient);
  if (!ingredients.length) return blog;

  const fresh = await verifyInventory(ingredients);
  if (inventoryKey(fresh) === inventoryKey(blog.inventoryStatus)) return blog;

  blog.inventoryStatus = fresh;
  try {
    await blog.save();
  } catch (err) {
    console.error('Inventory refresh save error:', err.message);
  }
  return blog;
}

router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort({ publishedAt: -1 });
    const out = await Promise.all(blogs.map((b) => refreshInventory(b)));
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs.' });
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogId: req.params.id });
    if (!blog) return res.status(404).json({ error: 'Blog not found.' });
    res.json(await refreshInventory(blog));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog.' });
  }
});

router.get('/missing-ingredients', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' });
    const missingMap = {};

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (const blog of blogs) {
      if (!blog.inventoryStatus || !blog.inventoryStatus.length) continue;

      if (blog.festivalDate && new Date(blog.festivalDate) < startOfToday) {
        continue;
      }

      // heals both directions: product appeared -> available, product gone -> unavailable
      await refreshInventory(blog);

      blog.inventoryStatus.forEach((inv) => {
        if (inv.available) return;

        if (!missingMap[inv.ingredient]) {
          missingMap[inv.ingredient] = {
            ingredient: inv.ingredient,
            blogs: [],
          };
        }
        missingMap[inv.ingredient].blogs.push({
          blogId: blog.blogId,
          title: blog.title,
          festival: blog.festival,
          festivalDate: blog.festivalDate,
        });
      });
    }

    res.json(Object.values(missingMap));
  } catch (err) {
    console.error('Get missing ingredients error:', err);
    res.status(500).json({ error: 'Failed to fetch missing ingredients.' });
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
      images: saveImages(images, 'blogs'),
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
    const existing = await Blog.findOne({ blogId: req.params.id });
    if (!existing) return res.status(404).json({ error: 'Blog not found.' });

    const update = { ...req.body };
    if (update.images) {
      update.images = saveImages(update.images, 'blogs');
      const kept = new Set(update.images);
      (existing.images || []).filter((v) => !kept.has(v)).forEach(removeImage);
    }
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
    const blog = await Blog.findOneAndDelete({ blogId: req.params.id });
    if (blog) removeImages(blog.images);
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
