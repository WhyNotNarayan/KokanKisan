require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmers');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const trustRoutes = require('./routes/trust');
const adminRoutes = require('./routes/admin');
const cultureRoutes = require('./routes/culture');
const greenRoutes = require('./routes/green');
const calendarRoutes = require('./routes/calendar');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/media', express.static(path.join(__dirname, '../uploads'), { maxAge: '7d', immutable: true }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/trust', trustRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/culture', cultureRoutes);
app.use('/api/green', greenRoutes);
app.use('/api/calendar', calendarRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

console.log('Connecting to MongoDB Atlas...');
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000,
    maxPoolSize: 10,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.error('Check: 1) Atlas cluster is Resumed (not Paused), 2) Network Access allows your IP, 3) MONGODB_URI in backend/.env is correct.');
    process.exit(1);
  });
