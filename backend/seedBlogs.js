require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./src/models/Blog');

const blogs = [
  {
    blogId: 'B001',
    title: 'Nag Panchami — Festival of Snakes',
    festival: 'Nag Panchami',
    festivalDate: new Date('2026-07-26'),
    sections: {
      whatIs: 'Nag Panchami is a traditional Hindu festival celebrated in honour of the snake deity (Nag). It is observed on the fifth day of Shukla Paksha in the month of Shravan (July/August). In Kokan, people worship Nag Devta by offering milk and flowers to snake images and live snakes. The festival marks the victory of snakes over humans in mythology and symbolises harmony between humans and nature.',
      whyTraditionalFood: 'On Nag Panchami, special dishes like Patolea (rice flour and jaggery steamed in turmeric leaves), Modak, and Puran Poli are prepared. These traditional foods are offered to the deity first and then shared among family and community members. The preparation is a family bonding ritual passed down through generations.',
      whyHealthy: 'Patolea is steamed (not fried) and wrapped in turmeric leaves which have anti-inflammatory properties. The use of jaggery instead of refined sugar provides iron and minerals. Coconut used in the filling is rich in healthy fats. These traditional foods are made with natural ingredients and are free from preservatives.',
      ingredients: 'To prepare traditional Nag Panchami foods, you need: fresh rice flour, organic jaggery, freshly grated coconut, turmeric leaves, cardamom, ghee, and garam masala. All ingredients are locally sourced from Kokan farms.',
    },
    ingredientTags: ['Rice', 'Coconut', 'Jaggery'],
    images: [],
    videoUrls: [],
    status: 'published',
    inventoryStatus: [
      { ingredient: 'Rice', available: true, farmerId: null, productId: null },
      { ingredient: 'Coconut', available: true, farmerId: null, productId: null },
      { ingredient: 'Jaggery', available: false, farmerId: null, productId: null },
    ],
    publishedAt: new Date('2026-07-01'),
  },
  {
    blogId: 'B002',
    title: 'Diwali — The Festival of Lights',
    festival: 'Diwali',
    festivalDate: new Date('2026-10-20'),
    sections: {
      whatIs: 'Diwali is the most celebrated festival in India, symbolising the victory of light over darkness and good over evil. In Kokan, Diwali is celebrated for five days with each day having its own significance — Dhanteras, Naraka Chaturdashi, Lakshmi Puja, Govardhan Puja, and Bhai Dooj. Homes are decorated with diyas, rangoli, and lights.',
      whyTraditionalFood: 'During Diwali, families prepare special sweets and snacks like Karanji (Gujiya), Chakli, Ladoo, Shrikhand, and Anarse. The tradition of making these at home ensures purity and freshness. Each dish has symbolic meaning — sweetness represents happiness and prosperity.',
      whyHealthy: 'Traditional Diwali snacks made at home use natural ingredients. Chakli made from rice flour and lentils provides protein and carbs. Anarse made from rice and jaggery is a healthier alternative to store-bought sweets. Using ghee instead of oil adds nutritional value.',
      ingredients: 'Essential ingredients for Diwali festivities: organic rice flour, urad dal, chana dal, fresh coconut, cardamom, saffron, organic ghee, jaggery, and dry fruits. All available from Kokan farmers.',
    },
    ingredientTags: ['Rice', 'Coconut', 'Spices', 'Jaggery'],
    images: [],
    videoUrls: [],
    status: 'published',
    inventoryStatus: [
      { ingredient: 'Rice', available: true, farmerId: null, productId: null },
      { ingredient: 'Coconut', available: true, farmerId: null, productId: null },
      { ingredient: 'Spices', available: true, farmerId: null, productId: null },
      { ingredient: 'Jaggery', available: false, farmerId: null, productId: null },
    ],
    publishedAt: new Date('2026-09-15'),
  },
  {
    blogId: 'B003',
    title: 'Shimga — Kokan\'s Carnival Festival',
    festival: 'Shimga',
    festivalDate: new Date('2027-03-10'),
    sections: {
      whatIs: 'Shimga is the grand carnival of Kokan, celebrated on the last day of the Hindu year before Holi. It is a week-long celebration with processions, music, dance, and community feasting. In Sindhudurg and Ratnagiri, Shimga is marked by elaborate processions with bullock carts, music troupes, and cultural performances. The festival strengthens community bonds.',
      whyTraditionalFood: 'Shimga is famous for its community feast called "Khall-bhaat" where the entire village cooks together. Special dishes include Ukda Modak (steamed rice dumplings), Solkadhi (coconut milk curry), Tisrya Masala (clams curry), and Bangda fry (mackerel). The communal cooking is a tradition that brings everyone together.',
      whyHealthy: 'Shimga foods are prepared with fresh, local ingredients. Solkadhi is made from kokum and coconut milk — both rich in antioxidants and probiotics. Steamed modak is healthier than fried snacks. Seafood dishes provide omega-3 fatty acids and lean protein.',
      ingredients: 'For the traditional Shimga feast: fresh coconut, kokum, rice, wheat flour, fresh fish (mackerel, clams), spices, jaggery, and ghee. All sourced from local Kokan farms and coastal waters.',
    },
    ingredientTags: ['Coconut', 'Rice', 'Wheat', 'Spices'],
    images: [],
    videoUrls: [],
    status: 'draft',
    inventoryStatus: [
      { ingredient: 'Coconut', available: true, farmerId: null, productId: null },
      { ingredient: 'Rice', available: false, farmerId: null, productId: null },
      { ingredient: 'Wheat', available: false, farmerId: null, productId: null },
      { ingredient: 'Spices', available: false, farmerId: null, productId: null },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const blog of blogs) {
      const existing = await Blog.findOne({ blogId: blog.blogId });
      if (existing) {
        await Blog.findOneAndUpdate({ blogId: blog.blogId }, blog);
        console.log(`Updated: ${blog.title}`);
      } else {
        await Blog.create(blog);
        console.log(`Created: ${blog.title}`);
      }
    }

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
