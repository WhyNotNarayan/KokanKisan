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

const FESTIVALS_2026 = [
  { name: 'Sharad Navratri Begins', month: 10, day: 11 },
  { name: 'Durga Puja - Maha Saptami begins', month: 10, day: 17 },
  { name: 'Maha Ashtami', month: 10, day: 18 },
  { name: 'Maha Navami', month: 10, day: 19 },
  { name: 'Dussehra / Vijayadashami', month: 10, day: 20 },
  { name: 'Sharad Purnima / Kojagiri Purnima', month: 10, day: 25 },
  { name: 'Maharishi Valmiki Jayanti', month: 10, day: 26 },
  { name: 'Karwa Chauth', month: 10, day: 29 },
  { name: 'Halloween', month: 10, day: 31 },
  { name: 'Naraka Chaturdashi', month: 11, day: 8 },
  { name: 'Diwali / Deepavali \u{1FA94}', month: 11, day: 8 },
  { name: 'Govardhan Puja / Annakut', month: 11, day: 9 },
  { name: 'Bhai Dooj / Bhau Beej', month: 11, day: 11 },
  { name: 'Chhath Puja', month: 11, day: 15 },
  { name: 'Christmas', month: 12, day: 25 },
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
  const list = Number(year) === 2026 ? FESTIVALS_2026 : INDIAN_FESTIVALS;
  return list.map((f) => ({
    title: f.name,
    date: new Date(year, f.month - 1, f.day),
    type: 'festival',
  }));
};

module.exports = mongoose.model('CalendarEvent', eventSchema);
module.exports.INDIAN_FESTIVALS = INDIAN_FESTIVALS;
module.exports.FESTIVALS_2026 = FESTIVALS_2026;
