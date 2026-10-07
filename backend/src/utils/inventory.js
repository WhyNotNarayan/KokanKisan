const Product = require('../models/Product');

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// An ingredient counts as available only when a live, in-stock product really
// supplies it: whole-word match on the product name, or an exact category name.
// (Never match on category *contains* — that made "rice" available via the
// "Rice & Grains" category even when no rice product existed.)
function matchesIngredient(product, ingredient) {
  const tag = String(ingredient || '').trim();
  if (!tag || !product) return false;
  const name = String(product.name || '');
  const rx = new RegExp(`\\b${escapeRegExp(tag)}\\b`, 'i');
  if (rx.test(name)) return true;
  const category = String(product.category || '').trim().toLowerCase();
  if (category && category === tag.toLowerCase()) return true;
  return false;
}

function loadAvailableProducts() {
  return Product.find({ isActive: true, inStock: true })
    .select('productId farmerId name category')
    .lean();
}

async function verifyInventory(ingredientTags) {
  const tags = Array.isArray(ingredientTags) ? ingredientTags : [];
  if (!tags.length) return [];
  const products = await loadAvailableProducts();
  return tags.map((tag) => {
    const product = products.find((p) => matchesIngredient(p, tag));
    if (product) {
      return {
        ingredient: tag,
        available: true,
        farmerId: product.farmerId || null,
        productId: product.productId,
      };
    }
    return { ingredient: tag, available: false, farmerId: null, productId: null };
  });
}

module.exports = { escapeRegExp, matchesIngredient, loadAvailableProducts, verifyInventory };
