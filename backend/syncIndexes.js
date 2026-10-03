require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  await Product.createIndexes();
  await Order.createIndexes();
  const fmt = (idx) => idx.map((i) => JSON.stringify(i.key)).join(' ');
  console.log('Product indexes:', fmt(await mongoose.connection.db.collection('products').indexes()));
  console.log('Order indexes:', fmt(await mongoose.connection.db.collection('orders').indexes()));
  process.exit(0);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
