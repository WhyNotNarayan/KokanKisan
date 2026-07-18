const express = require('express');
const auth = require('../middleware/auth');
const FarmerProfile = require('../models/FarmerProfile');
const { calculateTrustScore, getTrustBadge } = require('../utils/trustScore');

const router = express.Router();

router.get('/:farmerId', async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ uid: req.params.farmerId });
    if (!profile) {
      return res.status(404).json({ error: 'Farmer profile not found.' });
    }

    const badge = getTrustBadge(profile.trustScore);

    res.json({
      farmerId: profile.uid,
      trustScore: profile.trustScore,
      badge,
      pledgeSigned: profile.pledgeSigned,
      vouchCount: profile.vouchCount,
      totalSales: profile.totalSales,
      weeklyVideosUploaded: profile.weeklyVideosUploaded,
      flagsReceived: profile.flagsReceived,
    });
  } catch (err) {
    console.error('Get trust score error:', err);
    res.status(500).json({ error: 'Failed to fetch trust score.' });
  }
});

router.post('/recalculate/:farmerId', auth, async (req, res) => {
  try {
    const score = await calculateTrustScore(req.params.farmerId);
    const badge = getTrustBadge(score);

    res.json({ trustScore: score, badge });
  } catch (err) {
    console.error('Recalculate trust error:', err);
    res.status(500).json({ error: 'Failed to recalculate trust score.' });
  }
});

module.exports = router;
