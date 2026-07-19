const mongoose = require('mongoose');

const vouchSchema = new mongoose.Schema({
  vouchId: { type: String, required: true, unique: true },
  fromFarmerId: { type: String, required: true, ref: 'FarmerProfile' },
  toFarmerId: { type: String, required: true, ref: 'FarmerProfile' },
  createdAt: { type: Date, default: Date.now },
});

vouchSchema.index({ fromFarmerId: 1, toFarmerId: 1 }, { unique: true });

module.exports = mongoose.model('Vouch', vouchSchema);
