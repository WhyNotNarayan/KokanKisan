const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, ref: 'User' },
  aadharHash: { type: String, required: true },
  idCardImage: { type: String, default: '' },
  pledgeSigned: { type: Boolean, default: false },
  pledgeTimestamp: { type: Date },
  trustScore: { type: Number, default: 0, min: 0, max: 100 },
  vouchCount: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  weeklyVideosUploaded: { type: Number, default: 0 },
  lastVideoUpload: { type: Date },
  flagsReceived: { type: Number, default: 0 },
  greenFlags: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'suspended'], default: 'pending' },
  consentGiven: { type: Boolean, default: false },
  consentTimestamp: { type: Date },
  farmDescription: { type: String, default: '' },
  cropsGrown: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
