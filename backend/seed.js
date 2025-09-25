const mongoose = require('mongoose');
const Brand = require('./models/Brand');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/billing-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Sample brands data
const brandsData = [
  {
    name: 'Havells',
    tagline: 'powering lives',
    category: 'HR-FR',
    isActive: true
  },
  {
    name: 'Finolex',
    tagline: 'trusted for generations',
    category: 'FR-LSZH',
    isActive: true
  },
  {
    name: 'GM',
    tagline: 'quality wires',
    category: 'HR-FR',
    isActive: true
  },
  {
    name: 'Polycab',
    tagline: 'trusted by millions',
    category: 'HR-FR',
    isActive: true
  },
  {
    name: 'Goldmedal',
    tagline: 'excellence in wiring',
    category: 'HR-FR',
    isActive: true
  },
  {
    name: 'Apar',
    tagline: 'reliable solutions',
    category: 'HR-FR',
    isActive: true
  },
  {
    name: 'V-Guard',
    tagline: 'protecting what matters',
    category: 'HR-FR',
    isActive: true
  }
];

// Sample products data
const productsData = [
  {
    description: '1.0 Sqmm 90 Mtrs',
    listPrice: 2010,
    coilPrice: 1328
  },
  {
    description: '1.5 Sqmm 90 Mtrs',
    listPrice: 3020,
    coilPrice: 1996
  },
  {
    description: '2.5 Sqmm 90 Mtrs',
    listPrice: 4695,
    coilPrice: 3102
  },
  {
    description: '4.0 Sqmm 90 Mtrs',
    listPrice: 6875,
    coilPrice: 4543
  },
  {
    description: '6.0 Sqmm 90 Mtrs',
    listPrice: 10250,
    coilPrice: 6780
  },
  {
    description: '10.0 Sqmm 90 Mtrs',
    listPrice: 16800,
    coilPrice: 11100
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Brand.deleteMany({});
    await Product.deleteMany({});

    console.log('Cleared existing data');

    // Insert brands
    const brands = await Brand.insertMany(brandsData);
    console.log(`Inserted ${brands.length} brands`);

    // Insert products for each brand
    for (const brand of brands) {
      const productsForBrand = productsData.map(product => ({
        ...product,
        brand: brand._id
      }));
      
      await Product.insertMany(productsForBrand);
      console.log(`Inserted ${productsForBrand.length} products for ${brand.name}`);
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

db.once('open', () => {
  console.log('Connected to MongoDB');
  seedDatabase();
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
}); 