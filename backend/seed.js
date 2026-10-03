require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./src/models/User');
const FarmerProfile = require('./src/models/FarmerProfile');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');
const Review = require('./src/models/Review');
const Flag = require('./src/models/Flag');
const Vouch = require('./src/models/Vouch');
const Blog = require('./src/models/Blog');
const CalendarEvent = require('./src/models/CalendarEvent');
const { GreenReport, Petition, Drive, Volunteer, NewsItem } = require('./src/models/Green');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // ---- Clear existing ----
  await Promise.all([
    User.deleteMany({}), FarmerProfile.deleteMany({}), Product.deleteMany({}),
    Order.deleteMany({}), Review.deleteMany({}), Flag.deleteMany({}), Vouch.deleteMany({}),
    Blog.deleteMany({}), CalendarEvent.deleteMany({}), GreenReport.deleteMany({}),
    Petition.deleteMany({}), Drive.deleteMany({}), Volunteer.deleteMany({}), NewsItem.deleteMany({}),
  ]);
  console.log('Cleared collections');

  // ---- Users ----
  const users = [
    { uid: 'U001', name: 'Amit Patil', phone: '9876500001', email: 'amit@gmail.com', role: 'buyer', city: 'Mumbai', village: '', taluka: '' },
    { uid: 'U002', name: 'Sneha Desai', phone: '9876500002', email: 'sneha@gmail.com', role: 'buyer', city: 'Pune', village: '', taluka: '' },
    { uid: 'U003', name: 'Rahul Kadam', phone: '9876500003', email: 'rahul@gmail.com', role: 'buyer', city: 'Navi Mumbai', village: '', taluka: '' },
    { uid: 'U004', name: 'Kisan Sawant', phone: '9876500004', email: 'kisan@gmail.com', role: 'farmer', village: 'Kudal', taluka: 'Sindhudurg' },
    { uid: 'U005', name: 'Deepa Gaonkar', phone: '9876500005', email: 'deepa@gmail.com', role: 'farmer', village: 'Malvan', taluka: 'Sindhudurg' },
    { uid: 'U006', name: 'Arjun Naik', phone: '9876500006', email: 'arjun@gmail.com', role: 'farmer', village: 'Chiplun', taluka: 'Ratnagiri' },
  ];
  await User.insertMany(users);

  // ---- Farmer Profiles ----
  const farmers = [
    { uid: 'U004', aadharHash: 'hash_placeholder_1', status: 'approved', trustScore: 88, vouchCount: 3, totalSales: 42, totalEarnings: 15800, cropsGrown: ['Mango', 'Rice', 'Coconut'], farmDescription: 'Traditional organic farm near the river.' },
    { uid: 'U005', aadharHash: 'hash_placeholder_2', status: 'approved', trustScore: 76, vouchCount: 5, totalSales: 30, totalEarnings: 11200, cropsGrown: ['Fish', 'Coconut', 'Spices'], farmDescription: 'Coastal farm specializing in seafood and spices.' },
    { uid: 'U006', aadharHash: 'hash_placeholder_3', status: 'pending', trustScore: 0, vouchCount: 0, totalSales: 0, totalEarnings: 0, cropsGrown: ['Cashew', 'Jackfruit'], farmDescription: 'New farmer applying for approval.' },
  ];
  await FarmerProfile.insertMany(farmers);

  // ---- Products ----
  const products = [
    { productId: 'P001', farmerId: 'U004', name: 'Organic Alphonso Mango', category: 'Fruits', price: 400, quantity: 20, unit: 'kg', description: 'Sweet, naturally ripened Alphonso mangoes from Konkan.', advantages: '100% organic, no chemicals, hand-picked, rich in Vitamin C.', images: [], village: 'Kudal', taluka: 'Sindhudurg', inStock: true, isActive: true, flagCount: 0 },
    { productId: 'P002', farmerId: 'U004', name: 'Red Rice (Vaal Rice)', category: 'Rice & Grains', price: 80, quantity: 50, unit: 'kg', description: 'Local red rice grown with traditional methods.', advantages: 'High fiber, low GI, traditionally farmed.', images: [], village: 'Kudal', taluka: 'Sindhudurg', inStock: true, isActive: true, flagCount: 0 },
    { productId: 'P003', farmerId: 'U005', name: 'Fresh Coconut', category: 'Coconut Products', price: 35, quantity: 100, unit: 'piece', description: 'Tender coconuts from Malvan coast.', advantages: 'Natural electrolyte, farm fresh.', images: [], village: 'Malvan', taluka: 'Sindhudurg', inStock: true, isActive: true, flagCount: 0 },
    { productId: 'P004', farmerId: 'U005', name: 'Dry Malvani Masala', category: 'Spices', price: 150, quantity: 30, unit: 'piece', description: 'Authentic Malvani spice blend.', advantages: 'No preservatives, traditional recipe.', images: [], village: 'Malvan', taluka: 'Sindhudurg', inStock: true, isActive: true, flagCount: 0 },
    { productId: 'P005', farmerId: 'U006', name: 'Raw Cashew Nuts', category: 'Other', price: 600, quantity: 10, unit: 'kg', description: 'Freshly harvested cashews.', advantages: 'Single-origin, sun-dried.', images: [], village: 'Chiplun', taluka: 'Ratnagiri', inStock: false, isActive: true, flagCount: 0 },
    { productId: 'P006', farmerId: 'U004', name: 'Homemade Mango Pickle', category: 'Pickles & Homemade', price: 200, quantity: 25, unit: 'piece', description: 'Traditional aam panna pickle.', advantages: 'Homemade, no additives.', images: [], village: 'Kudal', taluka: 'Sindhudurg', inStock: true, isActive: true, flagCount: 2 },
  ];
  await Product.insertMany(products);

  // ---- Orders ----
  const orders = [
    { orderId: 'O001', buyerId: 'U001', farmerId: 'U004', productId: 'P001', productName: 'Organic Alphonso Mango', quantity: 2, pricePerUnit: 400, totalAmount: 800, commission: 56, farmerPayout: 744, status: 'Delivered', deliveryMethod: 'st_bus', deliveryAddress: 'Andheri, Mumbai', paymentId: 'pay_abc123', paymentStatus: 'completed' },
    { orderId: 'O002', buyerId: 'U002', farmerId: 'U005', productId: 'P003', productName: 'Fresh Coconut', quantity: 10, pricePerUnit: 35, totalAmount: 350, commission: 24, farmerPayout: 326, status: 'Dispatched', deliveryMethod: 'courier', deliveryAddress: 'Kothrud, Pune', paymentId: 'pay_def456', paymentStatus: 'completed' },
    { orderId: 'O003', buyerId: 'U003', farmerId: 'U004', productId: 'P002', productName: 'Red Rice (Vaal Rice)', quantity: 5, pricePerUnit: 80, totalAmount: 400, commission: 28, farmerPayout: 372, status: 'Confirmed', deliveryMethod: 'pickup', deliveryAddress: 'Vashi, Navi Mumbai', paymentId: 'pay_ghi789', paymentStatus: 'completed' },
    { orderId: 'O004', buyerId: 'U001', farmerId: 'U005', productId: 'P004', productName: 'Dry Malvani Masala', quantity: 3, pricePerUnit: 150, totalAmount: 450, commission: 31, farmerPayout: 419, status: 'Packed', deliveryMethod: 'community', deliveryAddress: 'Bandra, Mumbai', paymentId: 'pay_jkl012', paymentStatus: 'completed' },
  ];
  await Order.insertMany(orders);

  // ---- Reviews ----
  const reviews = [
    { reviewId: 'R001', orderId: 'O001', buyerId: 'U001', farmerId: 'U004', rating: 5, comment: 'Best mangoes ever, very fresh!' },
    { reviewId: 'R002', orderId: 'O002', buyerId: 'U002', farmerId: 'U005', rating: 4, comment: 'Good quality coconuts.' },
    { reviewId: 'R003', orderId: 'O004', buyerId: 'U001', farmerId: 'U005', rating: 5, comment: 'Authentic masala, loved it.' },
  ];
  await Review.insertMany(reviews);

  // ---- Flags ----
  const flags = [
    { flagId: 'FL001', productId: 'P006', buyerId: 'U002', reason: 'Packaging was damaged on arrival.' },
    { flagId: 'FL002', productId: 'P006', buyerId: 'U003', reason: 'Different from description.' },
  ];
  await Flag.insertMany(flags);

  // ---- Vouches ----
  const vouches = [
    { vouchId: 'V001', fromFarmerId: 'U005', toFarmerId: 'U004' },
    { vouchId: 'V002', fromFarmerId: 'U006', toFarmerId: 'U004' },
    { vouchId: 'V003', fromFarmerId: 'U004', toFarmerId: 'U005' },
  ];
  await Vouch.insertMany(vouches);

  // ---- Blogs (Culture Hub) ----
  const blogs = [
    {
      blogId: 'B001', title: 'Nag Panchami', festival: 'Nag Panchami', festivalDate: new Date('2026-08-25'),
      status: 'published', publishedAt: new Date(),
      sections: {
        whatIs: 'Nag Panchami is a Hindu festival honouring snakes, celebrated with devotion in Kokan.',
        whyTraditionalFood: 'Families prepare traditional sweets and vegetarian feasts as offering.',
        whyHealthy: 'The meal uses local grains and vegetables, naturally balanced and nutritious.',
        ingredients: 'Rice, coconut, jaggery, seasonal vegetables.',
      },
      ingredientTags: ['Rice', 'Coconut'],
      images: [],
      videoUrls: ['https://youtube.com/example'],
      inventoryStatus: [
        { ingredient: 'Rice', available: true, farmerId: 'U004', productId: 'P002' },
        { ingredient: 'Coconut', available: true, farmerId: 'U005', productId: 'P003' },
      ],
    },
    {
      blogId: 'B002', title: 'Diwali', festival: 'Diwali', festivalDate: new Date('2026-10-21'),
      status: 'published', publishedAt: new Date(),
      sections: {
        whatIs: 'Diwali, the festival of lights, is celebrated with lamps, sweets and togetherness.',
        whyTraditionalFood: 'Traditional Diwali snacks use home-ground flour and ghee.',
        whyHealthy: 'Homemade sweets avoid refined additives and excess sugar.',
        ingredients: 'Rice, coconut, jaggery, spices.',
      },
      ingredientTags: ['Rice', 'Coconut', 'Spices'],
      images: [],
      inventoryStatus: [
        { ingredient: 'Rice', available: true, farmerId: 'U004', productId: 'P002' },
        { ingredient: 'Coconut', available: true, farmerId: 'U005', productId: 'P003' },
        { ingredient: 'Spices', available: true, farmerId: 'U005', productId: 'P004' },
      ],
    },
    {
      blogId: 'B003', title: 'Shimga', festival: 'Shimga (Holi of Konkan)', festivalDate: new Date('2027-03-10'),
      status: 'draft',
      sections: {
        whatIs: 'Shimga is the Konkani celebration of spring, similar to Holi.',
        whyTraditionalFood: 'Special puran poli and festive dishes are prepared.',
        whyHealthy: 'Made from jaggery and whole grains.',
        ingredients: 'Jaggery, wheat, coconut.',
      },
      ingredientTags: ['Coconut', 'Wheat'],
      inventoryStatus: [
        { ingredient: 'Coconut', available: true, farmerId: 'U005', productId: 'P003' },
        { ingredient: 'Wheat', available: false, farmerId: null, productId: null },
      ],
    },
  ];
  await Blog.insertMany(blogs);

  // ---- Green Kokan ----
  const reports = [
    { reportId: 'GR001', reporterName: 'Sunil Mhatre', reporterPhone: '9876500007', title: 'Illegal tree cutting near Devbag', description: 'Several mangroves being cleared for construction.', photos: [], location: { lat: 16.0152, lng: 73.5223, address: 'Devbag, Sindhudurg' }, status: 'Under Review', escalatedTo: 'Forest Department', adminNote: 'Field visit scheduled.' },
    { reportId: 'GR002', reporterName: 'Meera Joshi', reporterPhone: '9876500008', title: 'Slope cutting in Chiplun', description: 'Hill slope cut without permission.', photos: [], location: { lat: 17.5211, lng: 73.8386, address: 'Chiplun, Ratnagiri' }, status: 'Submitted' },
    { reportId: 'GR003', reporterName: 'Anil Pawar', reporterPhone: '9876500009', title: 'Restored plantation', description: 'Community replanted 50 trees.', photos: [], location: { lat: 16.1053, lng: 73.4501, address: 'Malvan' }, status: 'Action Taken', adminNote: 'Verified by volunteer group.' },
  ];
  await GreenReport.insertMany(reports);

  const petitions = [
    { petitionId: 'PT001', title: 'Protect Devbag Mangroves', description: 'Demand immediate halt to mangrove clearing.', targetAuthority: 'District Collector', signatures: ['9876500007', '9876500008'], goal: 500 },
  ];
  await Petition.insertMany(petitions);

  const drives = [
    { driveId: 'DV001', title: 'Monsoon Tree Plantation', description: 'Plant native trees across Kokan villages.', date: new Date('2026-07-15'), location: 'Kudal, Sindhudurg', lat: 16.0032, lng: 73.7052, organizer: 'Green Kokan Volunteers', volunteersNeeded: 50 },
    { driveId: 'DV002', title: 'Coastal Cleanup Drive', description: 'Beach cleanup at Tarkarli.', date: new Date('2026-09-02'), location: 'Tarkarli, Malvan', lat: 16.0123, lng: 73.5145, organizer: 'Kokan Youth Group', volunteersNeeded: 30 },
  ];
  await Drive.insertMany(drives);

  const volunteers = [
    { volunteerId: 'VO001', name: 'Sunil Mhatre', phone: '9876500007', driveId: 'DV001', contributions: 3 },
    { volunteerId: 'VO002', name: 'Meera Joshi', phone: '9876500008', driveId: 'DV001', contributions: 2 },
    { volunteerId: 'VO003', name: 'Karan Patil', phone: '9876500010', driveId: 'DV002', contributions: 4 },
  ];
  await Volunteer.insertMany(volunteers);

  const news = [
    { newsId: 'NW001', title: 'Kokan records rise in organic farming', url: 'https://example.com/news1', source: 'Konkan Times', summary: 'More farmers adopting chemical-free methods.' },
    { newsId: 'NW002', title: 'Monsoon plantation drive exceeds target', url: 'https://example.com/news2', source: 'Green Daily', summary: 'Volunteers planted 5000 saplings.' },
  ];
  await NewsItem.insertMany(news);

  // ---- Calendar custom event ----
  await CalendarEvent.create({
    eventId: 'CE001', title: 'Admin Meet — KokanKisan', date: new Date('2026-09-20'),
    type: 'custom', description: 'Quarterly review with farmers.', createdBy: 'admin',
  });

  console.log('Seed data inserted successfully!');
  console.log('Collections: Users(6), Farmers(3), Products(6), Orders(4), Reviews(3), Flags(2), Vouches(3), Blogs(3), Reports(3), Petitions(1), Drives(2), Volunteers(3), News(2)');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
