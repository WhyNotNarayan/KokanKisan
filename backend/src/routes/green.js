const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { generateId } = require('../utils/helpers');
const { GreenReport, Petition, Drive, Volunteer, NewsItem } = require('../models/Green');

const router = express.Router();

// ===== Public: submit deforestation report =====
router.post('/reports', async (req, res) => {
  try {
    const { reporterName, reporterPhone, title, description, photos, lat, lng, address } = req.body;
    if (!lat || !lng) return res.status(400).json({ error: 'Location is required.' });
    const report = await GreenReport.create({
      reportId: generateId(),
      reporterName,
      reporterPhone,
      title,
      description,
      photos: photos || [],
      location: { lat, lng, address: address || '' },
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit report.' });
  }
});

// ===== Public: list reports (map) =====
router.get('/reports', async (req, res) => {
  try {
    const reports = await GreenReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});

// ===== Public: petitions =====
router.get('/petitions', async (req, res) => {
  try {
    const petitions = await Petition.find().sort({ createdAt: -1 });
    res.json(petitions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch petitions.' });
  }
});

router.post('/petitions/:id/sign', async (req, res) => {
  try {
    const { phone } = req.body;
    const petition = await Petition.findOneAndUpdate(
      { petitionId: req.params.id },
      { $addToSet: { signatures: phone } },
      { new: true }
    );
    if (!petition) return res.status(404).json({ error: 'Petition not found.' });
    res.json(petition);
  } catch (err) {
    res.status(500).json({ error: 'Failed to sign petition.' });
  }
});

// ===== Public: drives =====
router.get('/drives', async (req, res) => {
  try {
    const drives = await Drive.find().sort({ date: 1 });
    res.json(drives);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch drives.' });
  }
});

router.post('/drives/:id/volunteer', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const volunteer = await Volunteer.create({
      volunteerId: generateId(),
      name,
      phone,
      driveId: req.params.id,
    });
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register volunteer.' });
  }
});

// ===== Public: news =====
router.get('/news', async (req, res) => {
  try {
    const news = await NewsItem.find().sort({ createdAt: -1 }).limit(20);
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

// ===== Leaderboard =====
router.get('/leaderboard', async (req, res) => {
  try {
    const volunteers = await Volunteer.aggregate([
      { $group: { _id: '$name', contributions: { $sum: '$contributions' }, phone: { $first: '$phone' } } },
      { $sort: { contributions: -1 } },
      { $limit: 10 },
    ]);
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

// ===== Admin only =====
router.use(auth, roleCheck('admin'));

// Reports management
router.put('/reports/:id/status', async (req, res) => {
  try {
    const { status, escalationNote, escalatedTo, adminNote } = req.body;
    const report = await GreenReport.findOneAndUpdate(
      { reportId: req.params.id },
      { status, escalationNote, escalatedTo, adminNote },
      { new: true }
    );
    if (!report) return res.status(404).json({ error: 'Report not found.' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update report.' });
  }
});

// Petitions admin create
router.post('/petitions', async (req, res) => {
  try {
    const petition = await Petition.create({ petitionId: generateId(), ...req.body });
    res.status(201).json(petition);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create petition.' });
  }
});

// Drives admin create
router.post('/drives', async (req, res) => {
  try {
    const drive = await Drive.create({ driveId: generateId(), ...req.body });
    res.status(201).json(drive);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create drive.' });
  }
});

// News admin create
router.post('/news', async (req, res) => {
  try {
    const news = await NewsItem.create({ newsId: generateId(), ...req.body });
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create news.' });
  }
});

module.exports = router;
