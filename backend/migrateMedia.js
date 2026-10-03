require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Blog = require('./src/models/Blog');
const FarmerProfile = require('./src/models/FarmerProfile');
const { saveImage, isBase64Image } = require('./src/utils/media');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected. Migrating base64 images to disk...\n');
  let converted = 0;

  const products = await Product.find({});
  for (const p of products) {
    if (!Array.isArray(p.images) || !p.images.some(isBase64Image)) continue;
    p.images = p.images.map((v) => {
      const saved = saveImage(v, 'products');
      if (saved !== v) converted += 1;
      return saved;
    });
    await p.save();
    console.log(`Product ${p.productId}: images migrated`);
  }

  const blogs = await Blog.find({});
  for (const b of blogs) {
    if (!Array.isArray(b.images) || !b.images.some(isBase64Image)) continue;
    b.images = b.images.map((v) => {
      const saved = saveImage(v, 'blogs');
      if (saved !== v) converted += 1;
      return saved;
    });
    await b.save();
    console.log(`Blog ${b.blogId}: images migrated`);
  }

  const profiles = await FarmerProfile.find({ idCardImage: { $regex: '^data:image/' } });
  for (const f of profiles) {
    f.idCardImage = saveImage(f.idCardImage, 'idcards');
    await f.save();
    converted += 1;
    console.log(`Farmer ${f.uid}: id card migrated`);
  }

  console.log(`\nDone. ${converted} image(s) written to backend/uploads.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
