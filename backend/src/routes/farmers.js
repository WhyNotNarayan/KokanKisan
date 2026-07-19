const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Vouch = require('../models/Vouch');
const { generateId } = require('../utils/helpers');
const { calculateTrustScore } = require('../utils/trustScore');

const router = express.Router();

router.get('/zone/:taluka', async (req, res) => {
  try {
    const { taluka } = req.params;
    const farmers = await FarmerProfile.find({ status: 'approved' });
    const farmerUids = farmers.map((f) => f.uid);

    const users = await User.find({
      uid: { $in: farmerUids },
      taluka,
    }).select('uid name village taluka city profileImage');

    const enriched = await Promise.all(
      users.map(async (u) => {
        const profile = await FarmerProfile.findOne({ uid: u.uid });
        return {
          ...u.toObject(),
          trustScore: profile?.trustScore || 0,
          pledgeSigned: profile?.pledgeSigned || false,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error('Get farmers by zone error:', err);
    res.status(500).json({ error: 'Failed to fetch farmers.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.id }).select('-__v');
    if (!user) {
      return res.status(404).json({ error: 'Farmer not found.' });
    }

    const profile = await FarmerProfile.findOne({ uid: req.params.id });
    res.json({ ...user.toObject(), profile });
  } catch (err) {
    console.error('Get farmer error:', err);
    res.status(500).json({ error: 'Failed to fetch farmer.' });
  }
});

router.post('/register', auth, async (req, res) => {
  try {
    const { aadharNumber, farmDescription, cropsGrown } = req.body;

    if (!aadharNumber) {
      return res.status(400).json({ error: 'Aadhar number is required.' });
    }

    const existing = await FarmerProfile.findOne({ uid: req.uid });
    if (existing) {
      return res.status(400).json({ error: 'Farmer profile already exists.' });
    }

    const aadharHash = await bcrypt.hash(aadharNumber, 10);

    const profile = await FarmerProfile.create({
      uid: req.uid,
      aadharHash,
      farmDescription: farmDescription || '',
      cropsGrown: cropsGrown || [],
      status: 'pending',
    });

    await User.findOneAndUpdate({ uid: req.uid }, { role: 'farmer' });

    res.status(201).json({ message: 'Farmer registration submitted for approval.', profile });
  } catch (err) {
    console.error('Farmer register error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

router.put('/:id', auth, roleCheck('farmer', 'admin'), async (req, res) => {
  try {
    const updates = req.body;
    delete updates.uid;
    delete updates.trustScore;
    delete updates.status;

    const user = await User.findOneAndUpdate({ uid: req.params.id }, updates, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'Farmer not found.' });
    }

    res.json(user);
  } catch (err) {
    console.error('Update farmer error:', err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

router.post('/pledge', auth, roleCheck('farmer'), async (req, res) => {
  try {
    const profile = await FarmerProfile.findOneAndUpdate(
      { uid: req.uid },
      { pledgeSigned: true, pledgeTimestamp: new Date() },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: 'Farmer profile not found.' });
    }

    await calculateTrustScore(req.uid);

    res.json({ message: 'Pledge signed successfully.', profile });
  } catch (err) {
    console.error('Pledge error:', err);
    res.status(500).json({ error: 'Failed to sign pledge.' });
  }
});

router.post('/vouch', auth, roleCheck('farmer'), async (req, res) => {
  try {
    const { toFarmerId } = req.body;

    if (!toFarmerId) {
      return res.status(400).json({ error: 'Target farmer ID is required.' });
    }

    if (req.uid === toFarmerId) {
      return res.status(400).json({ error: 'Cannot vouch for yourself.' });
    }

    const existing = await Vouch.findOne({ fromFarmerId: req.uid, toFarmerId });
    if (existing) {
      return res.status(400).json({ error: 'Already vouched for this farmer.' });
    }

    const vouch = await Vouch.create({
      vouchId: generateId(),
      fromFarmerId: req.uid,
      toFarmerId,
    });

    await calculateTrustScore(toFarmerId);

    res.status(201).json({ message: 'Vouch recorded.', vouch });
  } catch (err) {
    console.error('Vouch error:', err);
    res.status(500).json({ error: 'Vouch failed.' });
  }
});

module.exports = router;
