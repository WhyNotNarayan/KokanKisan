const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const { generateId } = require('../utils/helpers');

const router = express.Router();

const otpStore = {};

router.post('/register', async (req, res) => {
  try {
    const { name, phone, role, village, taluka, city, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required.' });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ error: 'Phone number already registered.' });
    }

    const uid = generateId();
    const user = await User.create({
      uid,
      name,
      phone,
      email: email || '',
      role: role || 'buyer',
      village: village || '',
      taluka: taluka || '',
      city: city || '',
    });

    if (role === 'farmer') {
      const aadharHash = await bcrypt.hash(req.body.aadharNumber || 'placeholder', 10);
      await FarmerProfile.create({
        uid,
        aadharHash,
        status: 'pending',
      });
    }

    const token = jwt.sign({ uid, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { uid: user.uid, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phone] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ message: 'OTP sent to your phone.', phone });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required.' });
    }

    const stored = otpStore[phone];
    if (!stored) {
      return res.status(400).json({ error: 'No OTP sent to this number.' });
    }

    if (Date.now() > stored.expiresAt) {
      delete otpStore[phone];
      return res.status(400).json({ error: 'OTP has expired.' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    delete otpStore[phone];

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const token = jwt.sign({ uid: user.uid, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: { uid: user.uid, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: '123456',
};

router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const token = jwt.sign({ uid: 'admin', role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      message: 'Admin login successful',
      token,
      user: { uid: 'admin', name: 'Platform Admin', email: ADMIN_CREDENTIALS.email, role: 'admin' },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Admin login failed.' });
  }
});

module.exports = router;
