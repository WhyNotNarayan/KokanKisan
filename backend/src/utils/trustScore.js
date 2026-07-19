const FarmerProfile = require('../models/FarmerProfile');
const Review = require('../models/Review');
const Flag = require('../models/Flag');
const Vouch = require('../models/Vouch');

async function calculateTrustScore(farmerId) {
  const profile = await FarmerProfile.findOne({ uid: farmerId });
  if (!profile) return 0;

  const reviews = await Review.find({ farmerId });
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const flagCount = await Flag.countDocuments({
    productId: { $exists: true },
  });

  const farmerFlags = await Flag.aggregate([
    { $lookup: { from: 'products', localField: 'productId', foreignField: 'productId', as: 'product' } },
    { $unwind: '$product' },
    { $match: { 'product.farmerId': farmerId } },
    { $count: 'count' },
  ]);
  const flags = farmerFlags.length > 0 ? farmerFlags[0].count : 0;

  const vouchCount = await Vouch.countDocuments({ toFarmerId: farmerId });

  let score = 0;
  score += (profile.pledgeSigned ? 10 : 0);
  score += (vouchCount * 15);
  score += (avgRating * 10);
  score += (profile.weeklyVideosUploaded * 2);
  score -= (flags * 20);

  score = Math.max(0, Math.min(100, Math.round(score)));

  await FarmerProfile.findOneAndUpdate(
    { uid: farmerId },
    {
      trustScore: score,
      vouchCount,
      flagsReceived: flags,
    }
  );

  return score;
}

function getTrustBadge(score) {
  if (score >= 75) return { level: 'verified', label: 'Verified Natural Farmer', color: 'green' };
  if (score >= 40) return { level: 'building', label: 'Building Trust', color: 'amber' };
  return { level: 'review', label: 'Under Review', color: 'red' };
}

module.exports = { calculateTrustScore, getTrustBadge };
