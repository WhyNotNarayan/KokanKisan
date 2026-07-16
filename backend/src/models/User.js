const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, default: '' },
  role: { type: String, enum: ['buyer', 'farmer', 'admin'], default: 'buyer' },
  village: { type: String, default: '' },
  taluka: { type: String, default: '' },
  city: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
