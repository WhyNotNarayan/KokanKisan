const mongoose = require('mongoose');

const INDIAN_FESTIVALS = [
  { name: 'Makar Sankranti', month: 1, day: 14 },
  { name: 'Republic Day', month: 1, day: 26 },
  { name: 'Maha Shivaratri', month: 2, day: 18 },
  { name: 'Holi', month: 3, day: 14 },
  { name: 'Gudi Padwa', month: 3, day: 21 },
  { name: 'Ram Navami', month: 4, day: 6 },
  { name: 'Hanuman Jayanti', month: 4, day: 12 },
  { name: 'Akshaya Tritiya', month: 4, day: 22 },
  { name: 'Buddha Purnima', month: 5, day: 12 },
  { name: 'Nag Panchami', month: 7, day: 25 },
  { name: 'Raksha Bandhan', month: 8, day: 9 },
  { name: 'Janmashtami', month: 8, day: 16 },
  { name: 'Ganesh Chaturthi', month: 8, day: 27 },
  { name: 'Anant Chaturdashi', month: 9, day: 6 },
  { name: 'Navratri Begins', month: 9, day: 22 },
  { name: 'Dussehra', month: 10, day: 2 },
  { name: 'Diwali', month: 10, day: 21 },
  { name: 'Bhai Dooj', month: 10, day: 23 },
  { name: 'Shimga (Holi of Konkan)', month: 3, day: 10 },
  { name: 'Tulsi Vivah', month: 11, day: 15 },
  { name: 'Kartiki Ekadashi', month: 11, day: 22 },
  { name: 'Makar Sankranti / Tilgul', month: 1, day: 14 },
];

const eventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['festival', 'custom', 'blog', 'drive'], default: 'festival' },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  createdBy: { type: String, default: 'system' },
  createdAt: { type: Date, default: Date.now },
});

eventSchema.statics.getIndianFestivals = (year) => {
  return INDIAN_FESTIVALS.map((f) => ({
    title: f.name,
    date: new Date(year, f.month - 1, f.day),
    type: 'festival',
  }));
};

module.exports = mongoose.model('CalendarEvent', eventSchema);
module.exports.INDIAN_FESTIVALS = INDIAN_FESTIVALS;
