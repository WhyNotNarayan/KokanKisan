const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  reporterName: { type: String, default: 'Anonymous' },
  reporterPhone: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  photos: [{ type: String }],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Action Taken', 'Rejected'],
    default: 'Submitted',
  },
  escalationNote: { type: String, default: '' },
  escalatedTo: { type: String, default: '' },
  adminNote: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const petitionSchema = new mongoose.Schema({
  petitionId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  targetAuthority: { type: String, default: '' },
  signatures: [{ type: String }],
  goal: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
});

const driveSchema = new mongoose.Schema({
  driveId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  location: { type: String, default: '' },
  lat: { type: Number },
  lng: { type: Number },
  organizer: { type: String, default: '' },
  volunteersNeeded: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const volunteerSchema = new mongoose.Schema({
  volunteerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  driveId: { type: String, default: '' },
  contributions: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

const newsSchema = new mongoose.Schema({
  newsId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  url: { type: String, default: '' },
  source: { type: String, default: '' },
  summary: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  GreenReport: mongoose.model('GreenReport', reportSchema),
  Petition: mongoose.model('Petition', petitionSchema),
  Drive: mongoose.model('Drive', driveSchema),
  Volunteer: mongoose.model('Volunteer', volunteerSchema),
  NewsItem: mongoose.model('NewsItem', newsSchema),
};
